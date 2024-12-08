import { Component, computed, inject, Signal } from '@angular/core';
import { NotificationService, notificationTypes } from './notification.service';
import { WarnIconComponent } from '../icons/warn-icon.component';
import { InfoIconComponent } from '../icons/info-icon.component';
import { ErrorIconComponent } from '../icons/error-icon.component';
import { NgClass } from '@angular/common';

// The following will likely trigger the creation of many computed signals
// because angular usually calls function in th template every few few milliseconds
// this.iconMinWClass(notificationCountWarning)()

@Component({
  selector: 'app-notifications',
  imports: [WarnIconComponent, InfoIconComponent, ErrorIconComponent, NgClass],
  template: `
    <div [class]="'flex gap-2 rounded-sm' + ' ' + bgClass()">
      <div class="rounded-sm px-3 py-1 h-8 grow">
        @if (activeNotification(); as activeNotification) {
        {{ activeNotification.message }}
        }
      </div>

      @if (notificationCountTotal() > 0) {
      <button
        (click)="toggleNotificationBar()"
        class="px-3 ml-auto flex justify-center items-center gap-2 hover:bg-gray-400/20 rounded-sm transition-all"
      >
        @for (type of notificationTypes; track type) {
        <span class="flex items-center justify-center">
          @switch (type) { @case('info'){
          <app-info-icon />
          <span [ngClass]="[iconMinWClassInfo()]">
            {{ notificationCountByType().info }}
          </span>
          } @case( 'warning'){
          <app-warn-icon />
          <span [ngClass]="[iconMinWClassWarning()]">
            {{ notificationCountByType().warning }}
          </span>
          } @case('error'){
          <app-error-icon />
          <span [ngClass]="[iconMinWClassError()]">
            {{ notificationCountByType().error }}
          </span>
          }}
        </span>
        }
      </button>
      }
    </div>
  `,
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);

  notificationTypes = notificationTypes;

  activeNotification = this.notificationService.activeNotification;
  notificationCountByType = this.notificationService.notificationCountByType;
  notificationCountTotal = this.notificationService.notificationCountTotal;

  bgClass = computed(() => {
    const notification = this.activeNotification();
    if (notification) {
      switch (notification.type) {
        case 'info':
          return 'bg-blue-300';
        case 'warning':
          return 'bg-yellow-300';
        case 'error':
          return 'bg-red-300';
      }
    }

    return '';
  });

  iconMinWClassInfo = computed(() =>
    this.iconMinWClass(this.notificationCountByType().info)
  );

  iconMinWClassWarning = computed(() =>
    this.iconMinWClass(this.notificationCountByType().warning)
  );

  iconMinWClassError = computed(() =>
    this.iconMinWClass(this.notificationCountByType().error)
  );

  private iconMinWClass(count: number) {
    if (count < 10) {
      return 'min-w-3';
    } else if (count >= 10 && count < 100) {
      return 'min-w-5';
    }
    return 'min-w-3';
  }

  toggleNotificationBar() {
    this.notificationService.isNotificationBarActive.update((value) => !value);
  }
}
