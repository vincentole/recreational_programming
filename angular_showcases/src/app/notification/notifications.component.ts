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
        @if (activeNotification() !== null) {
        {{ activeNotification().message }}
        }
      </div>

      @if (notificationCountTotal() > 0) {
      <button (click)="toggleNotificationBar()">
        <div class="px-3 ml-auto flex justify-center items-center gap-2">
          @for (type of notificationTypes; track type) {
          <span class="flex items-center justify-center">
            @switch (type) { @case('info'){
            <app-info-icon />
            <span [ngClass]="[this.iconMinWClass(notificationCountInfo)()]">
              {{ notificationCountInfo() }}
            </span>
            } @case( 'warning'){
            <app-warn-icon />
            <span [ngClass]="[this.iconMinWClass(notificationCountWarning)()]">
              {{ notificationCountWarning() }}
            </span>
            } @case('error'){
            <app-error-icon />
            <span [ngClass]="[this.iconMinWClass(notificationCountError)()]">
              {{ notificationCountError() }}
            </span>
            }}
          </span>
          }
        </div>
      </button>
      }
    </div>
  `,
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);

  notificationTypes = notificationTypes;

  activeNotification = this.notificationService.activeNotification;
  notificationCountInfo = this.notificationService.notificationCountInfo;
  notificationCountWarning = this.notificationService.notificationCountWarning;
  notificationCountError = this.notificationService.notificationCountError;
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

  iconMinWClass(notificationCountSignal: Signal<number>) {
    return computed(() => {
      const count = notificationCountSignal();
      if (count < 10) {
        return 'min-w-3';
      } else if (count >= 10 && count < 100) {
        return 'min-w-5';
      }
      return 'min-w-3';
    });
  }

  toggleNotificationBar() {
    this.notificationService.isNotificationBarActive.update((value) => !value);
  }
}
