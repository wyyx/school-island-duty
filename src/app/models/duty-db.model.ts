export interface Grade {
  id?: number
  class_id?: number
  school_id?: number
  grade: string
  name?: string
  classList?: AClass[]
}

export interface AClass {
  class_id: number
  grade: string
  name: string
}

export interface DeviceConfig {
  id: number
  key: string
  val: number
  del: number
}

export interface CheckItem {
  id: number
  duty_check_item_config_id: number
  school_id: number
  check_name: string
  check_score: number
  description: string
  create_time: string
  update_time: string
  deleted: number
  checkSubItems?: CheckSubItem[]
}

export interface CheckSubItem {
  id: number
  duty_check_item_config_id: number
  duty_check_sub_item_config_id: number
  school_id: number
  name: string
  priority: number
  description: string
  score: number
  create_time: string
  update_time: string
  deleted: number
  scoreChange?: number
}

export interface DutyMedia {
  id: number
  duty_history_id: number
  type: number
  media_address: string
  create_time: string
  update_time: string
  deleted: number
}

export interface DutyHistoryItem {
  id: number
  uuid: number
  school_id: number
  class_id: number
  class_name: string
  duty_history_id: number
  type: number
  media_address: string
  create_time: string
  update_time: string
  deleted: number
  change_score: number
  status: number
}

export interface SubItemScoreHistoryItem {
  check_sub_id: number
  change_score: number
  create_time: string
  media_address: string[]
}

export interface DeductionPost {
  class_id: number
  check_id: number
  check_name: string
  autograph: string
  checkSub: CheckSubPost[]
}

export interface CheckSubPost {
  check_sub_id: number
  check_sub_name: string
  change_score: number
  is_media: number
  addressList: AddressList[]
}

export interface AddressList {
  type: number
  media_address: string
}
