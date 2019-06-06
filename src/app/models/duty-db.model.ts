export interface Grade {
  id: number
  class_id: number
  school_id: number
  grade: string
  name: string
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

export interface DutyConfig {
  id: number
  duty_check_item_config_id: number
  school_id: number
  check_name: string
  check_score: number
  description: string
  create_time: string
  update_time: string
  deleted: number
}

export interface DutySubConfig {
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

export interface DutyScoreHistory {
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
}
