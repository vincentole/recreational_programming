import { computed, Injectable, signal } from '@angular/core';

export type Notification = {
  id: number;
  type: NotificationTypes;
  message: string;
};
export const notificationTypes = ['info', 'warning', 'error'] as const;
export type NotificationTypes = (typeof notificationTypes)[number];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  isNotificationBarActive = signal(false);
  activeNotification = computed(() => this.activeNotificationSignal());

  notificationCountByType = computed(() =>
    notificationTypes.reduce((counts, type) => {
      counts[type] = this.notifications().filter((n) => n.type === type).length;
      return counts;
    }, {} as Record<NotificationTypes, number>)
  );

  notificationCountTotal = computed(() =>
    notificationTypes.reduce((count, type) => {
      return count + this.notificationCountByType()[type];
    }, 0)
  );

  notifications = computed(() => this.notificationsSignal());
  reversedNotifications = computed(() => {
    return [...this.notifications()].reverse();
  });

  private notificationsSignal = signal<Notification[]>([]);
  private activeNotificationSignal = signal<Notification | null>(null);
  private notificationTimeout: ReturnType<typeof setTimeout> | null = null;

  sendError(message: string) {
    this.sendNotificationByType(message, 'error');
  }

  sendWarning(message: string) {
    this.sendNotificationByType(message, 'warning');
  }

  sendInfo(message: string) {
    this.sendNotificationByType(message, 'info');
  }

  private sendNotificationByType(message: string, type: NotificationTypes) {
    const notification: Notification = {
      id: this.notificationCountTotal() + 1,
      type,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${message}`,
    };

    this.notificationsSignal.update((prev) => {
      if (prev.length >= 50) {
        prev.shift();
      }

      return [...prev, notification];
    });

    this.activeNotificationSignal.set(notification);

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      this.activeNotificationSignal.set(null);
      this.notificationTimeout = null;
    }, 4000);
  }
}
