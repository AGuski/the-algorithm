import { trigger, transition, style, animate } from '@angular/animations';

export const routePageAnimation = trigger('routePageAnimation', [
  transition('void => *', [
    style({ opacity: 0, transform: 'translateY(-50px)' }),
    animate('1s cubic-bezier(.24,.09,.34,.99)', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
])