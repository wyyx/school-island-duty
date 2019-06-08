import {
  AClass,
  CheckItem,
  CheckSubItem,
  Grade,
  SubItemScoreHistoryItem
} from '../models/duty-db.model'
import {
  checkItemList,
  checkSubItemList,
  classList,
  gradeList,
  subItemScoreHistoryAllClass
} from './duty.mock'

function convertToObject<T>(arr: T[]) {
  let result: { [key: number]: T } = {}

  for (let index = 0; index < arr.length; index++) {
    result = { ...result, [index]: arr[index] }
  }
  return result
}

export class DbService {
  /**
   * 查询本校所有的年级
   */
  // var grade;//年级的数组

  gradeList(): Promise<{ [key: number]: Grade }> {
    return new Promise((resolve, reject) => {
      resolve(convertToObject(gradeList))
    })
  }

  /**
   * 根据年级查询班级
   * @param grade 年级名称，如：2014级
   */
  classesList(grade: string): Promise<{ [key: number]: AClass }> {
    return new Promise((resolve, reject) => {
      const classListOfGrade = classList.filter(c => c.grade === grade)
      resolve(convertToObject(classListOfGrade))
    })
  }

  /**
   * 查询本pad可以行使的所有检查项
   */
  // 检查项的数组 大项
  itemList(): Promise<{ [key: number]: CheckItem }> {
    return new Promise((resolve, reject) => {
      // 查询大项
      resolve(convertToObject(checkItemList))
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
      const checkSubItemOfItem = checkSubItemList.filter(
        item => item.duty_check_item_config_id === itemId
      )
      convertToObject(checkSubItemOfItem)
    })
  }

  allItemList(): Promise<CheckItem[]> {
    return new Promise((resolve, reject) => {
      const result = checkItemList.map(item => {
        return {
          ...item,
          checkSubItems: checkSubItemList.filter(
            subItem => subItem.duty_check_item_config_id === item.duty_check_item_config_id
          )
        }
      })

      resolve(result)
    })
  }

  subItemScoreHistory(classId: number): Promise<SubItemScoreHistoryItem[]> {
    return new Promise((resolve, reject) => {
      resolve(subItemScoreHistoryAllClass[classId] || [])
    })
  }

  // /**
  //  * 直接加载一个页面的所有数据
  //  */

  // /**
  //  * 格式化日期为 xx年xx月xx日 xx时xx分xx秒
  //  * @param time 当前时间 new Date().getTime()
  //  * @returns {string} 格式化后的时间
  //  */

  // /**
  //  * 查询pad的扣分记录
  //  * @param type 为0时查询未上传的记录，不传时查询所有
  //  */
  // historyList(type?: 0): Promise<DutyHistoryItem[]> {
  //   return new Promise((resolve, reject) => {

  //   })
  // }

  // /**
  //  * 批量上传或者单个上传
  //  * @param id 某条记录的id， 如果不传id则上传所有未上传的记录
  //  */
  // updateTest(id) {
  //   return new Promise((resolve, reject) => {

  //   })
  // }

  // saveScore(data: DeductionPost) {
  //   return new Promise((resolve, reject) => {
  //     // 保存扣分记录
  //     // var data = {"class_id": 2, "check_id": 1, "check_name": "纪律", "autograph": "", "checkSub": [{"check_sub_id": 8, "check_sub_name": "上课说话", "change_score": 2, "is_media": 1, "addressList": [{"type": 1, "media_address": "路径为三"}, {"type": 1, "media_address": "路径为四"}]},{"check_sub_id": 2, "check_sub_name": "未按时出勤", "change_score": 3, "is_media": 1, "addressList": [{"type": 1, "media_address": "路径为三"}, {"type": 1, "media_address": "路径为三"}]}]};

  //   })
  // }
}

export const dbService = new DbService()
