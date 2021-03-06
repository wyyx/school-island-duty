import * as $ from 'jquery'
import {
  AClass,
  CheckItem,
  CheckSubItem,
  DeductionPost,
  DutyHistoryItem,
  Grade,
  SubItemScoreHistory,
  School
} from '../models/duty-db.model'
import { ResolveEnd } from '@angular/router'

const deviceCode = '1-002'
const password = '579814'
// const IP = 'http://192.168.1.10:8888'
const IP = 'http://xyd.husiwei.com'
//
// change when build
// const IP = '/api'

let db
declare let openDatabase: any

export class DbService {
  initDb() {
    this.Onload()

    // this.resetDb()
  }

  resetDb() {
    this.DropTable()
    this.InitDataAll()
  }

  Onload() {
    db = openDatabase('SqliteDB', '1.0', '', 2 * 1024 * 1024)
    console.log('TCL: Onload -> db', db)
    return db
  }

  /**
   * 出厂设置，应该有一个表，里面保存了设备的code和密码
   */
  factorySettings() {
    db.transaction(function(context) {
      context.executeSql(
        'CREATE TABLE "config" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"key" text(50) NOT NULL,"val" TEXT(200) NOT NULL,"del" integer DEFAULT 0);'
      )
      context.executeSql('INSERT INTO config(key,val) VALUES("1-002","579814")')
    })
  }

  /**
   * 通过设备码和密码登陆，请求服务端
   * deviceCode：设备码
   * password：密码
   * */
  binding(deviceCode, password) {
    return new Promise((resolve, reject) => {
      // 绑定设备

      $.ajax({
        type: 'POST',
        url: `${IP}/p/pad/login`,
        dataType: 'json',
        async: false,
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
          deviceCode,
          password
        }),
        success(data) {
          if (data.content == true) {
            db.transaction(
              function(context) {
                /*初始化时把所有表创建出来*/
                context.executeSql(
                  'CREATE TABLE "school" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"school_id" INTEGER,"school_name" text(100));'
                )
                context.executeSql(
                  'CREATE TABLE "class" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"class_id" INTEGER,"school_id" INTEGER,"grade" TEXT,"name" TEXT,"priority" INTEGER);'
                )
                context.executeSql(
                  'CREATE TABLE "duty_check_item_config" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_check_item_config_id" INTEGER,"school_id" integer,"check_name" TEXT(50),"check_score" real(8,3),"description" TEXT,"create_time" TEXT,"update_time" TEXT,"deleted" integer DEFAULT 0);'
                )
                context.executeSql(
                  'CREATE TABLE "duty_check_sub_item_config" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_check_sub_item_config_id" INTEGER,"school_id" INTEGER,"duty_check_item_config_id" INTEGER,"name" TEXT,"priority" integer,"description" TEXT,"score" real,"create_time" TEXT,"update_time" TEXT,"deleted" integer DEFAULT 0);'
                )
                context.executeSql(
                  'CREATE TABLE "duty_score_history" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"uuid" text,"school_id" INTEGER,"class_id" INTEGER,"class_name" TEXT,"check_id" INTEGER,"check_name" TEXT,"check_sub_id" INTEGER,"check_sub_name" TEXT,"change_score" TEXT,"remarks" TEXT,"executor_id" integer,"executor_name" TEXT,"is_media" integer,"autograph" TEXT,"status" integer DEFAULT 0,"create_time" TEXT,"update_time" text,"deleted" integer DEFAULT 0);'
                )
                context.executeSql(
                  'CREATE TABLE "duty_media" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_history_id" INTEGER,"type" integer,"media_address" TEXT,"create_time" TEXT,"update_time" text,"deleted" integer DEFAULT 0);'
                )

                context.executeSql(
                  'CREATE TABLE "config" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"key" text(50) NOT NULL,"val" TEXT(200) NOT NULL,"del" integer DEFAULT 0);'
                )
                context.executeSql(
                  `INSERT INTO config(key,val) VALUES("${deviceCode}","${password}")`
                )
              },
              function(error) {
                console.log('设备绑定失败:[' + error.message + ']')
                reject()
              },
              function() {
                console.log('设备绑定成功')
                resolve()
              }
            )
          } else {
            console.log('设备绑定失败')
            reject()
          }
        }
      })
    })
  }

  isBinding(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.transaction(
        function(context) {
          context.executeSql('SELECT key,val FROM config', [], function(tx, rs) {
            const result = rs.rows
            if (result.length == 0) {
              console.log('设备未绑定')
            } else {
              console.log('设备已绑定')
            }
          })
        },
        function(error) {
          console.log('error')
          reject(error)
        },
        function() {
          console.log('success')
          resolve()
        }
      )
    })
  }

  /**
   * 同步数据，获取本校的年级，班级，检查项等初始数据
   * 参数：无
   */
  synchronizationData() {
    // 同步数据
    return new Promise((resolve, reject) => {
      db.transaction(
        function(context) {
          context.executeSql('SELECT * FROM config', [], function(tx, rs) {
            const config = rs.rows[0]

            if (config == null) {
              return
            }

            $.ajax({
              type: 'POST',
              url: `${IP}/p/pad/init-data`,
              dataType: 'json',
              async: false,
              contentType: 'application/json;charset=UTF-8',
              data: JSON.stringify({
                codeId: config.key
              }),
              success(data) {
                if (data == null) {
                  return
                }
                /*修改pad密码，修改学校id和学校名字*/
                context.executeSql(`UPDATE config SET val="${data.content.padPassword}"`)

                context.executeSql('DROP TABLE IF EXISTS school')
                context.executeSql('DROP TABLE IF EXISTS class')
                context.executeSql('DROP TABLE IF EXISTS duty_check_item_config')
                context.executeSql('DROP TABLE IF EXISTS duty_check_sub_item_config')

                context.executeSql(
                  'CREATE TABLE "school" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"school_id" INTEGER,"school_name" text(100));'
                )
                context.executeSql(
                  'CREATE TABLE "class" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"class_id" INTEGER,"school_id" INTEGER,"grade" TEXT,"name" TEXT,"priority" INTEGER);'
                )
                context.executeSql(
                  'CREATE TABLE "duty_check_item_config" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_check_item_config_id" integer,"school_id" integer,"check_name" TEXT(50),"check_score" real(8,3),"description" TEXT,"create_time" TEXT,"update_time" TEXT,"deleted" integer DEFAULT 0);'
                )
                context.executeSql(
                  'CREATE TABLE "duty_check_sub_item_config" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_check_sub_item_config_id" INTEGER,"school_id" INTEGER,"duty_check_item_config_id" INTEGER,"name" TEXT,"priority" integer,"description" TEXT,"score" real,"create_time" TEXT,"update_time" TEXT,"deleted" integer DEFAULT 0);'
                )

                context.executeSql(
                  `INSERT INTO school(school_id,school_name) VALUES(${data.content.schoolId},"${
                    data.content.schoolName
                  }")`
                )
                // context.executeSql(`UPDATE school SET school_id=${data.content.schoolId},school_name="${data.content.schoolName}"`);

                const classes = data.content.classes
                if (classes != null) {
                  for (let i = 0; i < classes.length; i++) {
                    const sql = `INSERT INTO class(class_id,school_id,grade,name,priority) VALUES(${
                      classes[i].id
                    },${classes[i].schoolId},"${classes[i].grade}","${classes[i].name}",${
                      classes[i].priority
                    })`
                    context.executeSql(sql)
                  }
                }

                const checkItems = data.content.checkItems
                const date = timeStamp2String(new Date().getTime())
                if (checkItems != null) {
                  for (let i = 0; i < checkItems.length; i++) {
                    const sql = `INSERT INTO duty_check_item_config(duty_check_item_config_id,school_id,check_name,check_score,description,create_time,update_time) VALUES(${
                      checkItems[i].id
                    },${checkItems[i].schoolId},"${checkItems[i].checkName}",${
                      checkItems[i].checkScore
                    },"${checkItems[i].description}","${date}","${date}")`

                    context.executeSql(sql)
                  }
                }

                const subCheckItems = data.content.subCheckItems
                if (subCheckItems != null) {
                  for (let i = 0; i < subCheckItems.length; i++) {
                    const sql = `INSERT INTO duty_check_sub_item_config(duty_check_sub_item_config_id,school_id,duty_check_item_config_id,name,priority,description,score,create_time,update_time) VALUES(${
                      subCheckItems[i].id
                    },${subCheckItems[i].schoolId},${subCheckItems[i].dutyCheckItemConfigId},"${
                      subCheckItems[i].name
                    }",${subCheckItems[i].priority},"${subCheckItems[i].description}",${
                      subCheckItems[i].score
                    },"${date}","${date}")`

                    context.executeSql(sql)
                  }
                }

                resolve()
              }
            })
          })
        },
        function(error) {
          console.log('同步失败:[' + error.message + ']')
          reject()
        },
        function() {
          console.log('同步成功')
        }
      )
    })
  }

  upload() {
    return new Promise((resolve, reject) => {
      db.transaction(function(context) {
        const times = timeStamp2String(getFirstDayOfWeek(new Date()).getTime())
        context.executeSql(
          'SELECT * FROM duty_score_history WHERE status = 0 AND create_time > ?',
          [times],
          function(tx, results) {
            /*历史记录的结果集*/
            const historys = results.rows

            context.executeSql(
              'SELECT * FROM duty_media WHERE duty_history_id IN (SELECT id FROM duty_score_history WHERE status = 0 AND create_time > ?)',
              [times],
              function(tx, rs) {
                /*媒体的结果集*/
                const medias = rs.rows

                /*最终返回的实体的数组*/
                const historyVoArr = []

                for (let i = 0; i < historys.length; i++) {
                  /*指定一个数组放此记录的媒体地址的集合*/
                  const picture_urls = []

                  for (let j = 0; j < medias.length; j++) {
                    /*如果媒体关联id和历史记录的id相同，就保存在此记录的数组中*/
                    if (historys[i].id == medias[j].duty_history_id) {
                      picture_urls.push(medias[j].media_address)
                    }
                  }
                  /*最终返回的实体*/
                  const historyVo = {
                    shamId: historys[i].id,
                    uuid: historys[i].uuid.split('.')[0],
                    schoolId: historys[i].school_id,
                    classId: historys[i].class_id,
                    checkId: historys[i].check_id,
                    checkName: historys[i].check_name,
                    checkSubId: historys[i].check_sub_id,
                    checkSubName: historys[i].check_sub_name,
                    changeScore: historys[i].change_score,
                    autograph: historys[i].autograph,
                    createTime: new Date(historys[i].create_time),
                    pictureUrls: picture_urls
                  }
                  historyVoArr.push(historyVo)
                }

                $.ajax({
                  type: 'POST',
                  url: `${IP}/p/score/add`,
                  dataType: 'json',
                  async: false,
                  contentType: 'application/json; charset=utf-8',
                  data: JSON.stringify(historyVoArr),
                  success(data) {
                    console.log('TCL: DbService -> success -> data.content', data.content)
                    const shamIds = data.content
                    if (shamIds != null) {
                      const idStr = shamIds.join(',')
                      context.executeSql(
                        'UPDATE duty_score_history SET status = 1 WHERE id IN (' + idStr + ')'
                      )
                      console.log('执行成功')
                      resolve()
                    }
                  },
                  error() {
                    console.log('TCL: DbService -> upload -> error')

                    reject()
                    console.log('失败')
                  }
                })
              }
            )
          }
        )
      })
    })
  }

  getSchool(): Promise<School> {
    return new Promise((resolve, reject) => {
      db.transaction(function(context) {
        context.executeSql('SELECT school_id, school_name FROM school', [], function(tx, rs) {
          const schoolRes = rs.rows
          console.log('TCL: DbService -> synchronizationData -> schoolRes', schoolRes)

          const school_id = schoolRes[0].school_id
          const school_name = schoolRes[0].school_name

          resolve({ school_id, school_name })
        })
      })
    })
  }

  checkPassword(password: string) {
    return new Promise((resolve, reject) => {
      db.transaction(function(context) {
        context.executeSql('SELECT val FROM config WHERE val = ?', [password], function(tx, rs) {
          const result = rs.rows
          if (result.length == 0) {
            console.log('密码错误')
            reject()
          } else {
            console.log('密码正确')
            resolve()
          }
        })
      })
    })
  }

  /**
   * 查询本校所有的年级
   */
  // var grade;//年级的数组

  gradeList(): Promise<{ [key: number]: Grade }> {
    return new Promise((resolve, reject) => {
      db.transaction(
        function(context) {
          context.executeSql(
            'SELECT grade FROM class group by grade order by priority',
            [],
            function(tx, rs) {
              const grade = rs.rows

              if (grade == null) {
                return
              }

              resolve(grade)
            }
          )
        },
        function(error) {
          console.log('查询好多级列表失败:[' + error.message + ']')
          reject(error)
        },
        function() {
          console.log('查询好多级列表成功')
        }
      )
    })
  }

  /**
   * 根据年级查询班级
   * @param grade 年级名称，如：2014级
   */
  classesList(grade): Promise<AClass[]> {
    return new Promise((resolve, reject) => {
      db.transaction(
        function(context) {
          context.executeSql(
            'SELECT class_id,grade,name FROM class where grade = ?',
            [grade],
            function(tx, rs) {
              const results = rs.rows

              if (results == null) {
                return
              }

              let classes = []

              for (let i = 0; i < results.length; i++) {
                classes.push(results[i])
              }
              classes = classes.sort(sortClass)
              console.log(
                'TCL: DbService -> synchronizationData -> classes aaaaaaaaaaaaaaaaaaaaaaaaaaa',
                classes
              )

              resolve(classes)
            }
          )
        },
        function(error) {
          console.log('根据好多级查询班级拉失败:[' + error.message + ']')
          reject(error)
        },
        function() {
          console.log('根据好多级查询班级拉成功')
        }
      )
    })
  }

  gradeAndClass() {
    return new Promise((resolve, reject) => {
      db.transaction(
        function(context) {
          context.executeSql('SELECT grade FROM class GROUP BY grade ORDER BY grade', [], function(
            tx,
            rs
          ) {
            const grades = rs.rows

            console.log(grades[0])

            const gradeAndClasses = []

            let k = 0
            for (let i = 0; i < grades.length; i++) {
              context.executeSql(
                'SELECT class_id,name FROM class WHERE grade = ? ORDER BY name',
                [grades[k].grade],
                function(tx, rs) {
                  const classes = rs.rows
                  const classArr = []
                  for (let j = 0; j < classes.length; j++) {
                    classArr.push(classes[j])
                  }
                  const gradeAndClass = { grade: grades[k], classArr }
                  gradeAndClasses.push(gradeAndClass)
                  k++
                }
              )
            }
          })
        },
        function(error) {
          alert('查询年级列表失败')
        },
        function() {
          console.log('查询年级列表成功')
        }
      )
    })
  }

  /**
   * 查询本pad可以行使的所有检查项
   */
  // 检查项的数组 大项
  itemList(): Promise<{ [key: number]: CheckItem }> {
    return new Promise((resolve, reject) => {
      // 查询大项
      db.transaction(
        function(context) {
          context.executeSql(
            'SELECT duty_check_item_config_id,check_name FROM duty_check_item_config',
            [],
            function(tx, rs) {
              const items = rs.rows

              if (items == null) {
                return []
              }

              resolve(items)
            }
          )
        },
        function(error) {
          console.log('查询大项失败:[' + error.message + ']')
          reject(error)
        },
        function() {
          console.log('查询大项成功')
        }
      )
    })
  }

  /**
   * 根据检查大项的id获取其子项，并且获取当前班级在此子项中所扣的关系
   * @param item 检查大项的id，如：1
   * @param classId 班级id
   */
  // 子项的数组
  // 子项数组，包含了班级在该子项扣的分
  subItemList(
    itemId: number
  ): Promise<{
    [key: number]: CheckSubItem
  }> {
    return new Promise((resolve, reject) => {
      db.transaction(
        function(context) {
          /*根据大项查子项*/
          context.executeSql(
            'SELECT * FROM duty_check_sub_item_config WHERE duty_check_item_config_id=? ORDER BY duty_check_sub_item_config_id DESC',
            [itemId],
            function(tx, rs) {
              const subItems: {
                [key: number]: CheckSubItem
              } = rs.rows

              if (subItems == null) {
                return
              }

              resolve(subItems)
            }
          )
        },
        function(error) {
          console.log('查询大项的小项失败')
        },
        function() {
          console.log('查询大项的小项成功')
        }
      )
    })
  }

  allItemList(): Promise<{ item: CheckItem; subItemArr: CheckSubItem[] }[]> {
    return new Promise((resolve, reject) => {
      db.transaction(
        function(context) {
          context.executeSql(
            'SELECT duty_check_item_config_id,check_name FROM duty_check_item_config',
            [],
            function(tx, rs) {
              const items = rs.rows

              context.executeSql(
                'SELECT * FROM duty_check_sub_item_config ORDER BY priority',
                [],
                function(tx, rs) {
                  const subItems = rs.rows

                  const itemArr: { item: CheckItem; subItemArr: CheckSubItem[] }[] = []

                  /*遍历大项*/
                  for (let i = 0; i < items.length; i++) {
                    /*小项数组*/
                    const subItemArr = []
                    /*遍历小项*/
                    for (let j = 0; j < subItems.length; j++) {
                      /*如果id相同就添加*/
                      if (
                        items[i].duty_check_item_config_id == subItems[j].duty_check_item_config_id
                      ) {
                        subItemArr.push(subItems[j])
                      }
                    }
                    /*创建对象，包含一个大项，多个小项*/
                    const itemObj = { item: items[i], subItemArr }
                    itemArr.push(itemObj)
                  }

                  resolve(itemArr)
                }
              )
            }
          )
        },
        function(error) {
          console.log('查询大项失败')
          reject(error)
        },
        function() {
          console.log('查询大项成功')
        }
      )
    })
  }

  subItemScoreHistory(classId: number): Promise<SubItemScoreHistory[]> {
    return new Promise((resolve, reject) => {
      db.transaction(
        function(context) {
          context.executeSql(
            'SELECT duty_check_sub_item_config_id FROM duty_check_sub_item_config',
            [],
            function(tx, rs) {
              const checkSubIds = rs.rows

              const toDayDate = toDayTime(new Date())
              // var toDayTime = "2019-01-01";
              context.executeSql(
                'SELECT * FROM duty_score_history WHERE class_id = ? AND create_time > ?',
                [classId, toDayDate],
                function(tx, rs) {
                  // 本班级今天的历史纪录
                  const historys = rs.rows

                  context.executeSql(
                    'SELECT * FROM duty_media WHERE duty_history_id IN (SELECT id FROM duty_score_history WHERE class_id = ? AND create_time > ?)',
                    [classId, toDayDate],
                    function(tx, rs) {
                      // 历史纪录的图片
                      const medias = rs.rows

                      const checkSubScoreArr = []

                      for (let i = 0; i < checkSubIds.length; i++) {
                        const checkSubDeduction = {
                          check_sub_id: checkSubIds[i].duty_check_sub_item_config_id,
                          deductionArr: []
                        }

                        for (let j = 0; j < historys.length; j++) {
                          if (
                            checkSubIds[i].duty_check_sub_item_config_id == historys[j].check_sub_id
                          ) {
                            const media_address = []

                            for (let h = 0; h < medias.length; h++) {
                              if (medias[h].duty_history_id == historys[j].id) {
                                media_address.push(medias[h].media_address)
                              }
                            }

                            const deduction = {
                              create_time: historys[j].create_time,
                              change_score: historys[j].change_score,
                              media_address
                            }
                            checkSubDeduction.deductionArr.push(deduction)
                          }
                        }

                        if (checkSubDeduction.deductionArr.length > 0) {
                          checkSubScoreArr.push(checkSubDeduction)
                        }
                      }

                      resolve(checkSubScoreArr)
                    }
                  )
                }
              )
            }
          )
        },
        function(error) {
          reject(error)
        },
        function() {}
      )
    })
  }

  /**
   * 直接加载一个页面的所有数据
   */

  defaultData() {
    db.transaction(
      function(context) {
        /*1.查询年级*/
        context.executeSql('SELECT grade FROM class group by grade order by grade', [], function(
          tx,
          rs
        ) {
          const grade = rs.rows

          if (grade == null) {
            return
          }

          console.log('第一个年级是：' + grade[0].grade)

          /*2.查询班级，默认时第一个年级的所有班级*/
          context.executeSql(
            'SELECT class_id,grade,name FROM class where grade = ?',
            [grade[0].grade],
            function(tx, rs) {
              const classes = rs.rows

              if (classes == null) {
                return
              }

              console.log('第一个年级下的所有班级：' + classes)

              /*3.查询所有检查项*/
              context.executeSql(
                'SELECT duty_check_item_config_id,check_name FROM duty_check_item_config',
                [],
                function(tx, rs) {
                  const item = rs.rows

                  if (item == null) {
                    return
                  }

                  console.log('第一个检查项是：' + item[0])

                  /*4.查询检查子项，默认是第一个检查项的所有子项*/
                  context.executeSql(
                    'SELECT duty_check_sub_item_config_id,duty_check_item_config_id,name FROM duty_check_sub_item_config where duty_check_item_config_id=?',
                    [item[0].duty_check_item_config_id],
                    function(tx, rs) {
                      const subItem = rs.rows

                      if (subItem == null) {
                        return
                      }
                      console.log('第一个检查项的所有子项是：' + subItem)

                      /*JQuery获取本周一时间*/
                      const mondayDate = timeStamp2String(getFirstDayOfWeek(new Date()).getTime())
                      /*获取本周内，此班级在此检查子项中扣口的分*/
                      context.executeSql(
                        'SELECT check_sub_id,change_score,create_time FROM duty_score_history WHERE check_id=? AND create_time >= ? AND class_id = ?',
                        [item[0].duty_check_item_config_id, mondayDate, classes[0].class_id],
                        function(tx, rs) {
                          const score = rs.rows
                          const scoreListVo = []
                          for (let i = 0; i < subItem.length; i++) {
                            const scoreVo = {
                              duty_check_item_config_id: '',
                              duty_check_sub_item_config_id: '',
                              name: '',
                              score: []
                            }
                            scoreVo.duty_check_item_config_id = subItem[i].duty_check_item_config_id
                            scoreVo.duty_check_sub_item_config_id =
                              subItem[i].duty_check_sub_item_config_id
                            scoreVo.name = subItem[i].name
                            for (let j = 0; j < score.length; j++) {
                              if (
                                subItem[i].duty_check_sub_item_config_id == score[j].check_sub_id
                              ) {
                                scoreVo.score.push({
                                  change_score: score[j].change_score,
                                  create_time: score[j].create_time
                                })
                              }
                            }
                            scoreListVo.push(scoreVo)
                          }

                          console.log('子项展示出来应该是：' + scoreListVo)
                        }
                      )
                    }
                  )
                }
              )
            }
          )
        })
      },
      function(error) {
        console.log('页面默认数据失败:[' + error.message + ']')
      },
      function() {
        console.log('页面默认数据成功')
      }
    )
  }

  /**
   * 格式化日期为 xx年xx月xx日 xx时xx分xx秒
   * @param time 当前时间 new Date().getTime()
   * @returns {string} 格式化后的时间
   */

  /**
   * 查询pad的扣分记录
   * @param type 为0时查询未上传的记录，不传时查询所有
   */
  historyList(type?: 0): Promise<DutyHistoryItem[]> {
    return new Promise((resolve, reject) => {
      /*查询所有或者查询未上传*/
      let fragment = ''
      if (type != null) {
        fragment = ' AND status = 0 '
      }

      const toDay = '2019-01-01'
      // var toDay = toDayTime(new Date());

      db.transaction(function(context) {
        context.executeSql(
          'SELECT * FROM duty_score_history WHERE create_time > ? ' +
            fragment +
            ' ORDER BY create_time DESC',
          [toDay],
          function(tx, rs) {
            const results = rs.rows

            const historyArr = []

            context.executeSql(
              'SELECT duty_history_id,media_address FROM duty_media WHERE duty_history_id IN (SELECT id FROM duty_score_history WHERE create_time > ? ' +
                fragment +
                ' ORDER BY create_time)',
              [toDay],
              function(tx, rs) {
                const urls = rs.rows

                for (let i = 0; i < results.length; i++) {
                  const media_address = []

                  for (let j = 0; j < urls.length; j++) {
                    if (results[i].id == urls[j].duty_history_id) {
                      media_address.push(urls[j].media_address)
                    }
                  }
                  const history = {
                    create_time: results[i].create_time,
                    class_name: results[i].class_name,
                    change_score: results[i].change_score,
                    status: results[i].status,
                    media_address
                  }
                  historyArr.push(history)
                }

                resolve(historyArr)
              }
            )
          }
        )
      })
    })
  }

  /**
   * 批量上传或者单个上传
   * @param id 某条记录的id， 如果不传id则上传所有未上传的记录
   */
  updateTest(id) {
    return new Promise((resolve, reject) => {
      db.transaction(function(context) {
        let sqlHistory = ''
        if (id != null) {
          sqlHistory = ' AND id = ' + id
        }

        context.executeSql(
          'SELECT * FROM duty_score_history WHERE status = 0' + sqlHistory,
          [],
          function(tx, results) {
            /*历史记录的结果集*/
            const historys = results.rows

            context.executeSql(
              'SELECT * FROM duty_media WHERE duty_history_id IN (SELECT id FROM duty_score_history WHERE status = 0' +
                sqlHistory +
                ')',
              [],
              function(tx, rs) {
                /*媒体的结果集*/
                const medias = rs.rows

                /*最终返回的实体的数组*/
                const historyVoArr = []

                for (let i = 0; i < historys.length; i++) {
                  /*指定一个数组放此记录的媒体地址的集合*/
                  const picture_urls = []

                  for (let j = 0; j < medias.length; j++) {
                    /*如果媒体关联id和历史记录的id相同，就保存在此记录的数组中*/
                    if (historys[i].id == medias[j].duty_history_id) {
                      picture_urls.push(medias[j].media_address)
                    }
                  }
                  /*最终返回的实体*/
                  const historyVo = {
                    uuid: historys[i].uuid,
                    school_id: historys[i].school_id,
                    class_id: historys[i].class_id,
                    check_id: historys[i].check_id,
                    check_name: historys[i].check_name,
                    check_sub_id: historys[i].check_sub_id,
                    check_sub_name: historys[i].check_sub_name,
                    change_score: historys[i].change_score,
                    autograph: historys[i].autograph,
                    create_time: historys[i].create_time,
                    picture_urls
                  }
                  historyVoArr.push(historyVo)
                }

                $.ajax({
                  type: 'POST',
                  url: `${IP}/p/pad/init-data/p/score/test`,
                  dataType: 'json',
                  async: false,
                  contentType: 'application/json; charset=utf-8',
                  data: JSON.stringify(historyVoArr),
                  success() {
                    resolve()
                  },
                  error() {
                    reject()
                  }
                })
              }
            )
          }
        )
      })
    })
  }

  // test
  InitDataAll() {
    db.transaction(
      function(context) {
        $.ajax({
          type: 'POST',
          url: `${IP}/p/pad/test`,
          dataType: 'json',
          async: false,
          contentType: 'application/json;charset=UTF-8',
          success(data) {
            if (data == null) {
              console.log('数据获取失败，请检查网络')
              return
            }

            /*创建表*/
            context.executeSql(
              'CREATE TABLE "school" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"school_id" INTEGER,"school_name" text(100));'
            )
            context.executeSql(
              'CREATE TABLE "class" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"class_id" INTEGER,"school_id" INTEGER,"grade" TEXT,"name" TEXT);'
            )
            context.executeSql(
              'CREATE TABLE "duty_check_item_config" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_check_item_config_id" integer,"school_id" integer,"check_name" TEXT(50),"check_score" real(8,3),"description" TEXT,"create_time" TEXT,"update_time" TEXT,"deleted" integer DEFAULT 0);'
            )
            context.executeSql(
              'CREATE TABLE "duty_check_sub_item_config" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_check_sub_item_config_id" INTEGER,"school_id" INTEGER,"duty_check_item_config_id" INTEGER,"name" TEXT,"priority" integer,"description" TEXT,"score" real,"create_time" TEXT,"update_time" TEXT,"deleted" integer DEFAULT 0);'
            )
            context.executeSql(
              'CREATE TABLE "config" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"key" text(50) NOT NULL,"val" TEXT(200) NOT NULL,"del" integer DEFAULT 0);'
            )
            context.executeSql(
              'CREATE TABLE "duty_score_history" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"uuid" text,"school_id" INTEGER,"class_id" INTEGER,"class_name" TEXT,"check_id" INTEGER,"check_name" TEXT,"check_sub_id" INTEGER,"check_sub_name" TEXT,"change_score" TEXT,"remarks" TEXT,"executor_id" integer,"executor_name" TEXT,"is_media" integer,"autograph" TEXT,"status" integer DEFAULT 0,"create_time" TEXT,"update_time" text,"deleted" integer DEFAULT 0);'
            )
            context.executeSql(
              'CREATE TABLE "duty_media" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_history_id" INTEGER,"type" integer,"media_address" TEXT,"create_time" TEXT,"update_time" text,"deleted" integer DEFAULT 0);'
            )

            /*添加学校数据*/
            context.executeSql(
              `INSERT INTO school(school_id,school_name) VALUES(${data.content.schoolId},"${
                data.content.schoolName
              }")`
            )

            const classes = data.content.classes
            if (classes != null) {
              for (let i = 0; i < classes.length; i++) {
                const sql = `INSERT INTO class(class_id,school_id,grade,name) VALUES(${
                  classes[i].id
                },${classes[i].schoolId},"${classes[i].grade}","${classes[i].name}")`

                context.executeSql(sql)
              }
            }

            const checkItems = data.content.checkItems
            const date = timeStamp2String(new Date().getTime())
            if (checkItems != null) {
              for (let i = 0; i < checkItems.length; i++) {
                const sql = `INSERT INTO duty_check_item_config(duty_check_item_config_id,school_id,check_name,check_score,description,create_time,update_time) VALUES(${
                  checkItems[i].id
                },${checkItems[i].schoolId},"${checkItems[i].checkName}",${
                  checkItems[i].checkScore
                },"${checkItems[i].description}","${date}","${date}")`

                context.executeSql(sql)
              }
            }

            const subCheckItems = data.content.subCheckItems
            if (subCheckItems != null) {
              for (let i = 0; i < subCheckItems.length; i++) {
                const sql = `INSERT INTO duty_check_sub_item_config(duty_check_sub_item_config_id,school_id,duty_check_item_config_id,name,priority,description,score,create_time,update_time) VALUES(${
                  subCheckItems[i].id
                },${subCheckItems[i].schoolId},${subCheckItems[i].dutyCheckItemConfigId},"${
                  subCheckItems[i].name
                }",${subCheckItems[i].priority},"${subCheckItems[i].description}",${
                  subCheckItems[i].score
                },"${date}","${date}")`

                context.executeSql(sql)
              }
            }

            const h = data.content.dutyScoreHistory
            if (h != null) {
              for (let i = 0; i < h.length; i++) {
                const sql = `INSERT INTO duty_score_history(uuid,school_id,class_id,check_id,check_name,check_sub_id,check_sub_name,change_score,is_media,status,create_time) VALUES("${
                  h[i].uuid
                }",${h[i].schoolId},${h[i].classId},${h[i].checkId},"${h[i].checkName}",${
                  h[i].checkSubId
                },"${h[i].checkSubName}",${h[i].changeScore},1,0,"${h[i].createTime}")`

                context.executeSql(sql)
              }
            }

            const m = data.content.dutyMedia
            if (m != null) {
              for (let i = 0; i < m.length; i++) {
                const sql = `INSERT INTO duty_media(duty_history_id,type,media_address,create_time) VALUES(${
                  m[i].dutyHistoryId
                },1,"${m[i].mediaAddress}","${m[i].createTime}")`

                context.executeSql(sql)
              }
            }
          }
        })
      },
      function(error) {
        console.log('获取所有数据失败[' + error.message + ']')
      },
      function() {
        console.log('获取所有数据成功')
      }
    )
  }

  DropTable() {
    // 删除表
    db.transaction(
      function(context) {
        context.executeSql('DROP TABLE class')
        context.executeSql('DROP TABLE config')
        context.executeSql('DROP TABLE duty_check_sub_item_config')
        context.executeSql('DROP TABLE duty_media')
        context.executeSql('DROP TABLE duty_check_item_config')
        context.executeSql('DROP TABLE duty_score_history')
        context.executeSql('DROP TABLE school')
      },
      function(error) {
        console.log('删除表失败:[' + error.message + ']')
      },
      function() {
        console.log('删除表成功')
      }
    )
  }

  saveScore(data: DeductionPost) {
    return new Promise((resolve, reject) => {
      // 保存扣分记录
      // var data = {"class_id": 2, "check_id": 1, "check_name": "纪律", "autograph": "", "checkSub": [{"check_sub_id": 8, "check_sub_name": "上课说话", "change_score": 2, "is_media": 1, "addressList": [{"type": 1, "media_address": "路径为三"}, {"type": 1, "media_address": "路径为四"}]},{"check_sub_id": 2, "check_sub_name": "未按时出勤", "change_score": 3, "is_media": 1, "addressList": [{"type": 1, "media_address": "路径为三"}, {"type": 1, "media_address": "路径为三"}]}]};
      db.transaction(
        function(context) {
          /*查班级*/
          context.executeSql('SELECT * FROM class where class_id = ?', [data.class_id], function(
            tx,
            rs
          ) {
            const classObj = rs.rows[0] // 班级数据
            const date = timeStamp2String(new Date().getTime()) // 当前时间

            const checkSub = data.checkSub // 页面扣分
            let totalScore = 0 // 此检查大项 扣的总分
            // 计算扣的总分
            for (let i = 0; i < checkSub.length; i++) {
              totalScore = totalScore + checkSub[i].change_score
            }
            const mondayDate = timeStamp2String(getFirstDayOfWeek(new Date()).getTime()) // 获取本周周一的时间
            /*查询本周本检查项扣了多少分*/
            context.executeSql(
              'SELECT sum(change_score) change_score FROM duty_score_history WHERE check_id = ? AND class_id = ? AND create_time >= ?',
              [data.check_id, classObj.class_id, mondayDate],
              function(tx, rs) {
                const historyTotalScore =
                  rs.rows[0].change_score == null ? 0 : rs.rows[0].change_score // 本周此检查项扣的总分

                /*查询此检查项设置的最大分值*/
                context.executeSql(
                  'SELECT * FROM duty_check_item_config where duty_check_item_config_id = ? AND school_id = ?',
                  [data.check_id, classObj.school_id],
                  function(tx, rs) {
                    const score = rs.rows[0].check_score // 此检查项的分值
                    // 负值所以相减
                    if (-totalScore - historyTotalScore > score) {
                      console.log('每周扣分不能大于大项的分。。。')
                      reject()
                      return
                    }

                    let k = 0
                    for (let i = 0; i < checkSub.length; i++) {
                      const uuid = new Date().getTime() + Math.floor(Math.random() * 10)

                      /*添加历史数据*/
                      context.executeSql(
                        'INSERT INTO duty_score_history(uuid,school_id,class_id,class_name,check_id,check_name,check_sub_id,check_sub_name,change_score,remarks,executor_id,executor_name,is_media,autograph,create_time,update_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                        [
                          uuid,
                          classObj.school_id,
                          classObj.class_id,
                          classObj.grade + classObj.name,
                          data.check_id,
                          data.check_name,
                          checkSub[i].check_sub_id,
                          checkSub[i].check_sub_name,
                          checkSub[i].change_score,
                          '',
                          '',
                          '',
                          checkSub[i].is_media,
                          '',
                          date,
                          date
                        ],
                        function(tx, rs) {
                          if (checkSub[k].is_media == 1) {
                            const addressList = checkSub[k].addressList
                            for (let j = 0; j < addressList.length; j++) {
                              /*添加媒体数据*/
                              context.executeSql(
                                'INSERT INTO duty_media(duty_history_id,type,media_address,create_time,update_time) VALUES(?,?,?,?,?)',
                                [
                                  rs.insertId,
                                  addressList[j].type,
                                  addressList[j].media_address,
                                  date,
                                  date
                                ]
                              )
                            }
                          }
                          k++
                        }
                      )
                    }
                    resolve()
                  }
                )
              }
            )
          })
        },
        function(error) {
          console.log('保存扣分失败:[' + error.message + ']')
          reject()
        },
        function() {
          console.log('保存扣分成功')
        }
      )
    })
  }
}

function timeStamp2String(time) {
  const datetime = new Date()
  datetime.setTime(time)
  const year = datetime.getFullYear()
  const month =
    datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
  const date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
  const hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()
  const minute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()
  const second = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

// 获取当前周周一的时间
function getFirstDayOfWeek(date) {
  const day = date.getDay() || 7
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day)
}

/**
 * 格式化日期为 xx年xx月xx日
 * @param time 当前时间 new Date().getTime()
 * @returns {string}
 */
function toDayTime(time) {
  const datetime = new Date()
  datetime.setTime(time)
  const year = datetime.getFullYear()
  const month =
    datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
  const date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
  return year + '-' + month + '-' + date
}

function sortClass(a, b) {
  const aClass = a.name
  const bClass = b.name
  const aName = aClass.substring(0, aClass.length - 1)
  const bName = bClass.substring(0, bClass.length - 1)

  return aName - bName
}
export const dbService = new DbService()
