import mitt from 'mitt';
import { useEffect } from 'react';

export type SubscriptionEvents = keyof SubscriptionEventMap;

const emitter = mitt();

type SubscriptionEventMap = {
  'calendar-refresh': undefined;
  'auth-trigger': undefined;
};

export function useSubscription<T extends SubscriptionEvents>(
  eventName: T,
  cb: (event: SubscriptionEventMap[T]) => void
): void {
  useEffect(() => {
    emitter.on(eventName as any, cb as any);
    return () => emitter.off(eventName as any, cb as any);
  });
}

export function notify<T extends SubscriptionEvents>(
  eventName: T,
  event: SubscriptionEventMap[T]
) {
  emitter.emit(eventName, event);
}
