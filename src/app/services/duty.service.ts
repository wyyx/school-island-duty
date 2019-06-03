export interface DutyHistory {
  createdTime: string
  class: string
  score: number
  description: string[]
  status: number
}

export const dutyHistories: DutyHistory[] = [
  {
    createdTime: '2017-02-08 09:30:26',
    class: '2017级6班',
    score: 5.2,
    description: [
      'https://picsum.photos/id/906/600/900',
      'https://picsum.photos/id/455/900/600',
      'https://picsum.photos/id/678/600/900',
      'https://picsum.photos/id/123/500/500',
      'https://picsum.photos/id/809/1920/1080'
    ],
    status: 0
  },
  {
    createdTime: '2017-02-08 15:25:26',
    class: '2017级3班',
    score: 5.2,
    description: [
      'https://picsum.photos/id/444/600/900',
      'https://picsum.photos/id/456/600/900',
      'https://picsum.photos/id/234/600/900',
      'https://picsum.photos/id/789/600/900',
      'https://picsum.photos/id/887/600/900'
    ],
    status: 0
  },
  {
    createdTime: '2017-02-08 11:07:26',
    class: '2018级1班',
    score: 5.2,
    description: [
      'https://picsum.photos/id/345/600/900',
      'https://picsum.photos/id/456/600/900',
      'https://picsum.photos/id/445/600/900',
      'https://picsum.photos/id/267/600/900',
      'https://picsum.photos/id/999/600/900'
    ],
    status: 0
  }
]

export class DutyService {}
