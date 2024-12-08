import { Component, inject } from '@angular/core';
import { NotificationService } from './notification.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notifications-bar',
  imports: [NgClass],
  template: `
    <aside>
      <ul class="flex flex-col gap-2">
        @for (notification of notifications(); track notification.id) {
        <li
          [ngClass]="[
            notification.type === 'info' ? 'bg-blue-300' : '',
            notification.type === 'warning' ? 'bg-yellow-300' : '',
            notification.type === 'error' ? 'bg-red-300' : '',
            'rounded-md px-2 py-1'
          ]"
        >
          {{ notification.message }}
        </li>
        }
      </ul>
    </aside>
  `,
})
export class NotificationsBarComponent {
  notificationService = inject(NotificationService);

  notifications = this.notificationService.reversedNotifications;
}
