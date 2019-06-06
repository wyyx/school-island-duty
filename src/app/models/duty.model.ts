export interface DeductionCatetory {
  category: string
  deductionOptions: DeducionOption[]
}

export interface DeductionCatetoryModified {
  category: string
  deductionOptions: DeductionModified[]
}

export interface DeducionOption {
  id: number
  label: string | number
  rule: string
  value: number
}

export interface DeductionModified {
  score: number
  imgUrls: string[]
  deductionOption: DeducionOption
}

export interface GradeVo {
  label: string
  value: number | string
  classes: AClassVo[]
}

export interface AClassVo {
  label: string
  value: number
  id: number
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
