export interface Chip {
  label: string
  rule: string
  value: number
}

export interface Grade {
  label: string
  value: number
  classes: AClass[]
}

export interface AClass {
  label: string
  value: number
}

export interface NewDuty {
  changeScore: number
  checkId: number
  checkName: string
  checkSubId: number
  checkSubName: string
  classId: number
  createTime: string
  executorPictureUrl: string
  pictureUrls: string[]
  schoolId: number
  uuid: string
}

export interface AddDutyResponse {
  content: number
  errorCode: string
  errorMsg: string
  status: string
}

export interface DutyHistory {
  changeScore: number
  checkName: string
  checkSubName: string
  className: string
  createTime: string
  describeList: string[]
  status?: number
}

export interface GetDutyHistoryListResponse {
  content: DutyHistory[]
  errorCode: string
  errorMsg: string
  status: string
}
