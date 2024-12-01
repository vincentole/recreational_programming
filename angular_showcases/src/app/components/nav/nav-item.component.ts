import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Route } from '../../app.routes';

@Component({
  selector: 'app-nav-item',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <li>
      <a
        class="rounded-sm bg-orange-200 px-2 py-1 active:bg-orange-400 transition-all"
        [routerLink]="['/' + route().path]"
        routerLinkActive="bg-orange-300"
        ariaCurrentWhenActive="page"
      >
        {{ route().label }}
      </a>
    </li>
  `,
})
export class NavItemComponent {
  route = input.required<Route>();
}
