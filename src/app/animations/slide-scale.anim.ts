import { animate, style, transition, trigger } from '@angular/animations'

export const slideScaleAnim = trigger('slideScaleAnim', [
  transition(':enter', [
    style({
      transform: 'scale(0)',
      opacity: 0
    }),
    animate(
      '0.3s ease-in-out',
      style({
        transform: 'scale(1)',
        opacity: 1
      })
    )
  ]),
  transition(':leave', [
    style({
      transform: 'scale(1)',
      opacity: 1
    }),
    animate(
      '0.3s ease-in-out',
      style({
        transform: 'scale(0)',
        opacity: 0
      })
    )
  ])
])
