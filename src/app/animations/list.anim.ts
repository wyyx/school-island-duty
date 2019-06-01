import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations'

export const listAnim = trigger('listAnim', [
  transition(':increment', [
    query(
      ':enter',
      [
        style({
          transform: 'scale(0)',
          opacity: 0
          // height: '0px',
          // margin: '0px',
          // 'z-index': 50
        }),
        stagger(100, [
          group([
            animate(
              '0.3s ease-in-out',
              style({
                transform: 'scale(1)',
                opacity: 1
                // height: '200px',
                // 'margin-bottom': '36px'
              })
            )
          ])
        ])
      ],
      { optional: true }
    )
  ]),
  transition(':decrement', [
    query(
      ':leave',
      [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        stagger(100, [
          group([
            animate(
              '0.2s ease-in-out',
              style({ transform: 'scale(0)', height: '0px', margin: '0px' })
            ),
            animate('0.2s ease-in-out', style({ opacity: 0 }))
          ])
        ])
      ],
      { optional: true }
    )
  ])
])
