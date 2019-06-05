import * as $ from 'jquery'

import { Grade, AClass } from '../models/duty.model'

let db
declare let openDatabase: any

export function Onload() {
  db = openDatabase('SqliteDB', '1.0', '', 2 * 1024 * 1024)
  console.log('TCL: Onload -> db', db)
  return db
}

/**
 * 出厂设置，应该有一个表，里面保存了设备的code和密码
 */
function factorySettings() {
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
function binding(deviceCode, password) {
  // 绑定设备
  deviceCode = '1-002'
  password = '579814'

  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:8888/w/pad/login',
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
            context.executeSql('DROP TABLE config')

            /*初始化时把所有表创建出来*/
            context.executeSql(
              'CREATE TABLE "school" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"school_id" INTEGER,"school_name" text(100));'
            )
            context.executeSql(
              'CREATE TABLE "class" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"class_id" INTEGER,"school_id" INTEGER,"grade" TEXT,"name" TEXT);'
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
            context.executeSql(`INSERT INTO config(key,val) VALUES("${deviceCode}","${password}")`)
          },
          function(error) {
            console.log('设备绑定失败:[' + error.message + ']')
          },
          function() {
            console.log('设备绑定成功')
          }
        )
      } else {
        console.log('设备绑定失败')
      }
    }
  })
}

/**
 * 同步数据，获取本校的年级，班级，检查项等初始数据
 * 参数：无
 */
function synchronizationDate() {
  // 同步数据

  db.transaction(
    function(context) {
      context.executeSql('SELECT * FROM config', [], function(tx, rs) {
        const config = rs.rows[0]

        if (config == null) {
          return
        }

        $.ajax({
          type: 'POST',
          url: 'http://127.0.0.1:8888/w/pad/init-data',
          dataType: 'json',
          async: false,
          contentType: 'application/json;charset=UTF-8',
          data: JSON.stringify({
            codeId: config.key
          }),
          success(data) {
            if (data == null) {
              alert('空')
              return
            }
            /*修改pad密码，修改学校id和学校名字*/
            context.executeSql(`UPDATE config SET val="${data.content.padPassword}"`)

            context.executeSql('DROP TABLE school')
            context.executeSql('DROP TABLE class')
            context.executeSql('DROP TABLE duty_check_item_config')
            context.executeSql('DROP TABLE duty_check_sub_item_config')

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
              `INSERT INTO school(school_id,school_name) VALUES(${data.content.schoolId},"${
                data.content.schoolName
              }")`
            )
            // context.executeSql(`UPDATE school SET school_id=${data.content.schoolId},school_name="${data.content.schoolName}"`);

            const classes = data.content.classes
            if (classes != null) {
              for (let i = 0; i < classes.length; i++) {
                const sql = `INSERT INTO class(class_id,school_id,grade,name) VALUES(${
                  classes[i].id
                },${classes[i].schoolId},"${classes[i].grade}","${classes[i].name}")`
                console.log(sql)
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
                console.log(sql)
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
                console.log(sql)
                context.executeSql(sql)
              }
            }
          }
        })
      })
    },
    function(error) {
      console.log('同步失败:[' + error.message + ']')
    },
    function() {
      console.log('同步成功')
    }
  )
}

/**
 * 查询本校所有的年级
 */
// var grade;//年级的数组

function gradeList(): Promise<Grade[]> {
  return new Promise((resolve, reject) => {
    db.transaction(
      function(context) {
        context.executeSql('SELECT grade FROM class group by grade order by grade', [], function(
          tx,
          rs
        ) {
          const grade = rs.rows

          if (grade == null) {
            return
          }

          console.log(grade)

          resolve(grade)
        })
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
function classesList(grade): Promise<AClass[]> {
  return new Promise((resolve, reject) => {
    db.transaction(
      function(context) {
        context.executeSql(
          'SELECT class_id,grade,name FROM class where grade = ?',
          [grade],
          function(tx, rs) {
            const classes = rs.rows

            if (classes == null) {
              return
            }

            resolve(classes)

            console.log(classes)
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

/**
 * 查询本pad可以行使的所有检查项
 */
// 检查项的数组 大项
function itemList(): Promise<any[]> {
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
function subItemList(item, classId) {
  return new Promise((resolve, reject) => {
    // 查询大项的小项
    db.transaction(
      function(context) {
        context.executeSql(
          'SELECT duty_check_sub_item_config_id,duty_check_item_config_id,name FROM duty_check_sub_item_config where duty_check_item_config_id=? AND class_id = ?',
          [item, classId],
          function(tx, rs) {
            const subItems = rs.rows

            console.log(subItems)

            if (subItems == null) {
              return
            }

            /*查询小巷在本班扣过的分*/
            context.executeSql(
              'select check_sub_id,change_score,create_time from duty_score_history where check_id=?',
              [item],
              function(tx, rs) {
                const score = rs.rows
                const scoreListVo = []
                for (let i = 0; i < subItems.length; i++) {
                  const scoreVo = { subItems: '', score: [] }
                  scoreVo.subItems = subItems[i]
                  for (let j = 0; j < score.length; j++) {
                    if (subItems[i].duty_check_sub_item_config_id == score[j].check_sub_id) {
                      scoreVo.score.push({
                        change_score: score[j].change_score,
                        create_time: score[j].create_time
                      })
                    }
                  }
                  scoreListVo.push(scoreVo)
                }

                resolve({
                  subItems,
                  scoreListVo
                })
              }
            )
          }
        )
      },
      function(error) {
        console.log('查询大项的小项失败:[' + error.message + ']')
      },
      function() {
        console.log('查询大项的小项成功')
      }
    )
  })
}

/**
 * 直接加载一个页面的所有数据
 */

function defaultData() {
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
                            if (subItem[i].duty_check_sub_item_config_id == score[j].check_sub_id) {
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
 * 保存一个扣分记录
 * @param classId 班级id
 * @param checkId 检查大项id
 * @param checkName 检查大项名字
 * @param checkSub 检查子项的数组，每个元素应该包含( checkSubId:检查子项id, checkSubName:检查子项名字, changeScore:扣分的分值，应该为负数 , is_media是否有媒体默认是必须有,addressList:图片地址的集合 )
 */
function scoreSave(classId, checkId, checkName, checkSub) {
  // 保存扣分记录
  const data = {
    class_id: 2,
    check_id: 1,
    check_name: '纪律',
    autograph: '',
    checkSub: [
      {
        check_sub_id: 8,
        check_sub_name: '上课说话',
        change_score: 2,
        is_media: 1,
        addressList: [
          { type: 1, media_address: '路径为三' },
          { type: 1, media_address: '路径为四' }
        ]
      },
      {
        check_sub_id: 2,
        check_sub_name: '未按时出勤',
        change_score: 3,
        is_media: 1,
        addressList: [
          { type: 1, media_address: '路径为三' },
          { type: 1, media_address: '路径为三' }
        ]
      }
    ]
  }

  return new Promise((resolve, reject) => {
    db.transaction(
      function(context) {
        context.executeSql('SELECT * FROM class where class_id = ?', [data.class_id], function(
          tx,
          rs
        ) {
          const classes = rs.rows[0] // 班级数据
          const date = timeStamp2String(new Date().getTime()) // 当前时间

          const checkSub = data.checkSub // 页面扣分
          let totalScore = 0 // 此检查大项 扣的总分
          // 计算扣的总分
          for (let i = 0; i < checkSub.length; i++) {
            totalScore = totalScore + checkSub[i].change_score
          }
          const mondayDate = timeStamp2String(getFirstDayOfWeek(new Date()).getTime()) // 获取本周周一的时间
          context.executeSql(
            'SELECT sum(change_score) change_score FROM duty_score_history where check_id = ? and create_time >= ?',
            [data.check_id, mondayDate],
            function(tx, rs) {
              const historyTotalScore =
                rs.rows[0].change_score == null ? 0 : rs.rows[0].change_score // 本周此检查项扣的总分

              /*查询此检查项设置的最大分值*/
              context.executeSql(
                'SELECT * FROM duty_check_item_config where duty_check_item_config_id = ?',
                [data.check_id],
                function(tx, rs) {
                  const score = rs.rows[0].check_score // 此检查项的分值
                  if (totalScore + historyTotalScore > score) {
                    console.log('每周扣分不能大于大项的分。。。')
                    return
                  }

                  let k = 0
                  for (let i = 0; i < checkSub.length; i++) {
                    const uuid = new Date().getTime()
                    context.executeSql(
                      'INSERT INTO duty_score_history(uuid,school_id,class_id,class_name,check_id,check_name,check_sub_id,check_sub_name,change_score,remarks,executor_id,executor_name,is_media,autograph,create_time,update_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [
                        uuid,
                        classes.school_id,
                        classes.class_id,
                        classes.grade + classes.name,
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
                }
              )
            }
          )
        })
      },
      function(error) {
        console.log('保存扣分失败:[' + error.message + ']')
        reject(error)
      },
      function() {
        resolve()
        console.log('保存扣分成功')
      }
    )
  })
}

/**
 * 格式化日期为 xx年xx月xx日 xx时xx分xx秒
 * @param time 当前时间 new Date().getTime()
 * @returns {string} 格式化后的时间
 */
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

/**
 * 格式化日期为 xx年xx月xx日
 * @param time 当前时间 new Date().getTime()
 * @returns {string}
 */
function toDay(time) {
  const datetime = new Date()
  datetime.setTime(time)
  const year = datetime.getFullYear()
  const month =
    datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
  const date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
  return year + '-' + month + '-' + date
}

/**
 * 查询pad的扣分记录
 * @param type 为0时查询未上传的记录，不传时查询所有
 */
function historyList(type) {
  return new Promise((resolve, reject) => {
    db.transaction(function(context) {
      /*查询所有或者查询未上传*/
      let fragment = ' '
      if (type != null) {
        fragment = ' AND status = 0 '
      }

      const toDayRes = toDay(new Date().getTime())

      context.executeSql(
        'SELECT * FROM duty_score_history WHERE create_time = ?' +
          fragment +
          'ORDER BY create_time',
        [toDay],
        function(tx, results) {
          const historys = results.rows

          resolve(historys)

          let k = 0
          for (let i = 0; i < historys.length; i++) {
            context.executeSql(
              'SELECT media_address FROM duty_media WHERE duty_history_id = ?',
              [historys[k].id],
              function(tx, rs) {
                const urls = rs.rows
                const urlArr = []
                for (let j = 0; j < urls.length; j++) {
                  urlArr.push(urls[j].media_address)
                }

                console.log(
                  historys[k].create_time,
                  historys[k].class_name,
                  historys[k].change_score,
                  historys[k].status,
                  urlArr
                )
                k++
              }
            )
          }
        }
      )
    })
  })
}

/**
 * 批量上传或者单个上传
 * @param id 某条记录的id， 如果不传id则上传所有未上传的记录
 */
function updateTest(id) {
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
                url: 'http://127.0.0.1:8888/w/score/test',
                dataType: 'json',
                async: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(historyVoArr),
                success() {
                  alert('成功')
                  resolve()
                },
                error() {
                  alert('失败')
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

// 获取当前周周一的时间
function getFirstDayOfWeek(date) {
  const day = date.getDay() || 7
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day)
}
