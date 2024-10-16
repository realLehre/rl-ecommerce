import {
  animation,
  trigger,
  animateChild,
  group,
  transition,
  animate,
  style,
  query,
} from '@angular/animations';
export const transitionAnimation = animation([
  style({
    height: '{{ height }}',
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}',
  }),
  animate('{{ time }}'),
]);
// Routable animations
export const slideInAnimation = trigger('routeAnimations', [
  transition('sign-in <=> sign-up', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: '111px',
        left: 0,
        background: '#F6F1E9',
        width: '100%',
        'z-index': '10000',
        'max-width': '600px',
      }),
    ]),
    query(':enter', [style({ left: '-100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('500ms ease', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('500ms ease', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  // transition('sign-up <=> sign-in', [
  //   style({ position: 'relative' }),
  //   query(
  //     ':enter, :leave',
  //     [
  //       style({
  //         position: 'absolute',
  //         top: '111px',
  //         left: 0,
  //         width: '100%',
  //         background: '#F6F1E9',
  //         'max-width': '600px',
  //         'z-index': '10000',
  //       }),
  //     ],
  //     { optional: true },
  //   ),
  //   query(':enter', [style({ left: '-100%' })], { optional: true }),
  //   query(':leave', animateChild(), { optional: true }),
  //   group([
  //     query(
  //       ':leave',
  //       [animate('200ms ease', style({ left: '100%', opacity: 0 }))],
  //       {
  //         optional: true,
  //       },
  //     ),
  //     query(':enter', [animate('500ms ease', style({ left: '0%' }))], {
  //       optional: true,
  //     }),
  //     query('@*', animateChild(), { optional: true }),
  //   ]),
  // ]),
]);
