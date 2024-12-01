import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  template: `
    <app-nav class="border-b border-gray-200 p-4" />

    <main class="flex-1 p-4">
      <router-outlet />
    </main>

    <footer class="border-t border-gray-200 text-right px-4 py-1">
      © vincentole
    </footer>
  `,
})
export class AppComponent {
  routes = routes;
}
