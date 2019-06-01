export interface Grade {
  label: string
  value: number
  classes: AClass[]
}

export interface AClass {
  label: string
  value: number
}

export const grades: Grade[] = [
  {
    label: '一年级',
    value: 1,
    classes: [
      {
        label: '一班',
        value: 1
      },
      {
        label: '二班',
        value: 2
      },
      {
        label: '三班',
        value: 3
      },
      {
        label: '四班',
        value: 4
      },
      {
        label: '五班',
        value: 5
      },
      {
        label: '六班',
        value: 6
      },
      {
        label: '七班',
        value: 7
      },
      {
        label: '八班',
        value: 8
      },
      {
        label: '九班',
        value: 9
      },
      {
        label: '十班',
        value: 10
      }
    ]
  },
  {
    label: '二年级',
    value: 2,
    classes: [
      {
        label: '一班',
        value: 1
      },
      {
        label: '二班',
        value: 2
      },
      {
        label: '三班',
        value: 3
      },
      {
        label: '四班',
        value: 4
      },
      {
        label: '五班',
        value: 5
      },
      {
        label: '六班',
        value: 6
      }
    ]
  },
  {
    label: '三年级',
    value: 3,
    classes: [
      {
        label: '一班',
        value: 1
      },
      {
        label: '二班',
        value: 2
      },
      {
        label: '三班',
        value: 3
      },
      {
        label: '四班',
        value: 4
      },
      {
        label: '五班',
        value: 5
      },
      {
        label: '六班',
        value: 6
      },
      {
        label: '七班',
        value: 7
      },
      {
        label: '八班',
        value: 8
      }
    ]
  },
  {
    label: '四年级',
    value: 4,
    classes: [
      {
        label: '一班',
        value: 1
      },
      {
        label: '二班',
        value: 2
      },
      {
        label: '三班',
        value: 3
      },
      {
        label: '四班',
        value: 4
      }
    ]
  },
  {
    label: '五年级',
    value: 5,
    classes: [
      {
        label: '一班',
        value: 1
      },
      {
        label: '二班',
        value: 2
      },
      {
        label: '三班',
        value: 3
      },
      {
        label: '四班',
        value: 4
      },
      {
        label: '五班',
        value: 5
      },
      {
        label: '六班',
        value: 6
      },
      {
        label: '七班',
        value: 7
      },
      {
        label: '八班',
        value: 8
      },
      {
        label: '九班',
        value: 9
      }
    ]
  },
  {
    label: '六年级',
    value: 6,
    classes: [
      {
        label: '一班',
        value: 1
      },
      {
        label: '二班',
        value: 2
      },
      {
        label: '三班',
        value: 3
      },
      {
        label: '四班',
        value: 4
      },
      {
        label: '五班',
        value: 5
      },
      {
        label: '六班',
        value: 6
      },
      {
        label: '七班',
        value: 7
      }
    ]
  }
]
