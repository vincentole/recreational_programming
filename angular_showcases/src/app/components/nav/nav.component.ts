import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { NavItemComponent } from './nav-item.component';

@Component({
  selector: 'app-nav',
  imports: [NavItemComponent],
  template: `
    <nav>
      <ul class="flex gap-2">
        @for (route of routes; track route.path) {
        <app-nav-item [route]="route" />
        }
      </ul>
    </nav>
  `,
})
export class NavComponent {
  routes = routes;
}
