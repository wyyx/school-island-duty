import { DutyHistory } from '../models/duty.model'
import {
  Grade,
  AClass,
  CheckItem,
  CheckSubItem,
  SubItemScoreHistoryItem
} from '../models/duty-db.model'

export const dutyHistoryList: DutyHistory[] = [
  {
    createTime: '2017-02-08 09:30:26',
    className: '2017级6班',
    checkName: 'string',
    checkSubName: 'string',
    changeScore: 5.2,
    describeList: [
      'https://picsum.photos/id/906/600/900',
      'https://picsum.photos/id/455/900/600',
      'https://picsum.photos/id/678/600/900',
      'https://picsum.photos/id/123/500/500',
      'https://picsum.photos/id/809/1920/1080'
    ],
    status: 1
  },

  {
    createTime: '2017-02-08 09:30:26',
    className: '2017级8班',
    checkName: 'string',
    checkSubName: 'string',
    changeScore: 5.2,
    describeList: [
      'https://picsum.photos/id/444/600/900',
      'https://picsum.photos/id/456/600/900',
      'https://picsum.photos/id/234/600/900',
      'https://picsum.photos/id/789/600/900',
      'https://picsum.photos/id/887/600/900'
    ],
    status: 0
  },

  {
    createTime: '2017-02-08 09:30:26',
    className: '2015级2班',
    checkName: 'string',
    checkSubName: 'string',
    changeScore: 5.2,
    describeList: [
      'https://picsum.photos/id/345/600/900',
      'https://picsum.photos/id/456/600/900',
      'https://picsum.photos/id/445/600/900',
      'https://picsum.photos/id/267/600/900',
      'https://picsum.photos/id/999/600/900'
    ],
    status: 0
  }
]

export const gradeList: Grade[] = [
  {
    grade: '2015级'
  },
  {
    grade: '2016级'
  },
  {
    grade: '2017级'
  }
]

export const classList: AClass[] = [
  {
    class_id: 1,
    grade: '2015级',
    name: '一班'
  },
  {
    class_id: 2,
    grade: '2015级',
    name: '二班'
  },
  {
    class_id: 3,
    grade: '2016级',
    name: '五班'
  },
  {
    class_id: 4,
    grade: '2017级',
    name: '三班'
  },
  {
    class_id: 5,
    grade: '2017级',
    name: '四班'
  },
  {
    class_id: 6,
    grade: '2017级',
    name: '五班'
  },
  {
    class_id: 7,
    grade: '2017级',
    name: '六班'
  }
]

export const checkItemList: CheckItem[] = [
  {
    id: 0,
    duty_check_item_config_id: 0,
    school_id: 1,
    check_name: '纪律',
    check_score: 1,
    description: 'string',
    create_time: '2019-5-15 13:28',
    update_time: '2019-5-16 09:07',
    deleted: 1
  },
  {
    id: 1,
    duty_check_item_config_id: 1,
    school_id: 1,
    check_name: '卫生',
    check_score: 1,
    description: 'string',
    create_time: '2019-6-18 15:28',
    update_time: '2019-6-21 10:23',
    deleted: 1
  }
]

export const checkSubItemList: CheckSubItem[] = [
  {
    id: 0,
    duty_check_item_config_id: 0,
    duty_check_sub_item_config_id: 10,
    school_id: 1,
    name: '纪律差1',
    priority: 5,
    description: '纪律差1，纪律差1，纪律差1，纪律差1，纪律差1，',
    score: 15,
    create_time: '2019-7-11 11:55',
    update_time: '2019-7-23 9:46',
    deleted: 1
  },
  {
    id: 0,
    duty_check_item_config_id: 0,
    duty_check_sub_item_config_id: 11,
    school_id: 1,
    name: '纪律差2',
    priority: 5,
    description: '纪律差2，纪律差2，纪律差2，纪律差2，',
    score: 15,
    create_time: '2019-7-11 11:55',
    update_time: '2019-7-23 9:46',
    deleted: 1
  },
  {
    id: 0,
    duty_check_item_config_id: 1,
    duty_check_sub_item_config_id: 12,
    school_id: 1,
    name: '脏乱差1',
    priority: 5,
    description: '卫生不达标',
    score: 15,
    create_time: '2019-7-11 11:55',
    update_time: '2019-7-23 9:46',
    deleted: 1
  },
  {
    id: 0,
    duty_check_item_config_id: 1,
    duty_check_sub_item_config_id: 13,
    school_id: 1,
    name: '脏乱差2',
    priority: 5,
    description: '卫生不达标',
    score: 15,
    create_time: '2019-7-11 11:55',
    update_time: '2019-7-23 9:46',
    deleted: 1
  },
  {
    id: 0,
    duty_check_item_config_id: 1,
    duty_check_sub_item_config_id: 14,
    school_id: 1,
    name: '脏乱差3',
    priority: 5,
    description: '卫生不达标',
    score: 15,
    create_time: '2019-7-11 11:55',
    update_time: '2019-7-23 9:46',
    deleted: 1
  }
]

export const subItemScoreHistoryAllClass: { [key: number]: SubItemScoreHistoryItem[] } = {
  1: [
    {
      change_score: -5,
      check_sub_id: 10,
      create_time: '2019-7-11 11:55',
      media_address: [
        'https://picsum.photos/id/124/200/300',
        'https://picsum.photos/id/555/200/300',
        'https://picsum.photos/id/1053/200/300'
      ]
    },
    {
      change_score: -3,
      check_sub_id: 10,
      create_time: '2019-7-13 10:08',
      media_address: ['https://picsum.photos/id/555/200/300']
    },
    {
      change_score: -8.5,
      check_sub_id: 10,
      create_time: '2019-7-14 15:30',
      media_address: [
        'https://picsum.photos/id/678/200/300',
        'https://picsum.photos/id/329/200/300'
      ]
    },
    {
      change_score: -2,
      check_sub_id: 11,
      create_time: '2019-7-20 16:49',
      media_address: ['https://picsum.photos/id/44/200/300', 'https://picsum.photos/id/736/200/300']
    }
  ],
  2: [
    {
      change_score: -9,
      check_sub_id: 11,
      create_time: '2019-7-20 16:49',
      media_address: ['https://picsum.photos/id/44/200/300', 'https://picsum.photos/id/736/200/300']
    },
    {
      change_score: -11.5,
      check_sub_id: 11,
      create_time: '2019-7-22 9:38',
      media_address: ['https://picsum.photos/id/44/200/300', 'https://picsum.photos/id/736/200/300']
    }
  ]
}
