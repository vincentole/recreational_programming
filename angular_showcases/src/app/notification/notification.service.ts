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
  notificationCountInfo = computed(
    () => this.notificationsSignal().filter((n) => n.type === 'info').length
  );
  notificationCountWarning = computed(
    () => this.notificationsSignal().filter((n) => n.type === 'warning').length
  );
  notificationCountError = computed(
    () => this.notificationsSignal().filter((n) => n.type === 'error').length
  );
  notificationCountTotal = computed(
    () =>
      this.notificationCountInfo() +
      this.notificationCountWarning() +
      this.notificationCountError()
  );
  notifications = computed(() => this.notificationsSignal());
  reversedNotifications = computed(() => {
    return structuredClone(this.notifications()).reverse();
  });

  private notificationsSignal = signal<Notification[]>([]);
  private activeNotificationSignal = signal<Notification | null>(null);
  private notificationTimeout: ReturnType<typeof setTimeout> | null = null;

  sendError(message: string) {
    const notification: Notification = {
      id: this.notificationCountTotal() + 1,
      type: 'error',
      message: `Error: ${message}`,
    };

    this.sendNotification(notification);
  }

  sendWarning(message: string) {
    const notification: Notification = {
      id: this.notificationCountTotal() + 1,
      type: 'warning',
      message: `Warning: ${message}`,
    };

    this.sendNotification(notification);
  }

  sendInfo(message: string) {
    const notification: Notification = {
      id: this.notificationCountTotal() + 1,
      type: 'info',
      message: `Info: ${message}`,
    };

    this.sendNotification(notification);
  }

  private sendNotification(notification: Notification) {
    this.notificationsSignal.update((prev) => {
      if (prev.length > 49) {
        prev.pop();
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
