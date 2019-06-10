import * as moment from 'moment'

export class DateUtil {
  getTime(date: string) {
    return moment(date).format('H:mm')
  }

  getDate(date: string) {
    return moment(date).format('YYYY.M.D')
  }
}

export const dateUtil = new DateUtil()
