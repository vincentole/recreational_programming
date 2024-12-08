import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { NavComponent } from './nav/nav.component';
import { NotificationsComponent } from './notification/notifications.component';
import { NotificationsBarComponent } from './notification/notifications-bar.component';
import { NotificationService } from './notification/notification.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavComponent,
    NotificationsComponent,
    NotificationsBarComponent,
    NgClass,
  ],
  template: `
    <div class="min-h-screen flex">
      <div
        [ngClass]="[
          'main-content flex flex-col grow transition-all duration-300',
          isNotificationBarActive() ? 'max-w-[calc(100%-16rem)]' : 'max-w-full'
        ]"
      >
        <header class="border-b border-gray-200 p-4">
          <app-nav />
        </header>

        <app-notifications class="px-1 py-1" />

        <main class="flex-1 p-4">
          <router-outlet />
        </main>

        <footer class="border-t border-gray-200 text-right px-4 py-1">
          © vincentole
        </footer>
      </div>

      <app-notifications-bar
        [ngClass]="[
          'fixed right-0 top-0 bottom-0 w-64 border-l border-gray-200  transition-transform duration-300 p-2 overflow-auto',
          isNotificationBarActive() ? 'translate-x-0' : 'translate-x-full'
        ]"
      >
      </app-notifications-bar>
    </div>
  `,
})
export class AppComponent {
  notificationService = inject(NotificationService);

  isNotificationBarActive = this.notificationService.isNotificationBarActive;
  routes = routes;
}
