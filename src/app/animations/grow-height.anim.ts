import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations'

export const growHeightAnim = trigger('growHeightAnim', [transition(':increment', [])])
