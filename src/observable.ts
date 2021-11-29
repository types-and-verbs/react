import { User } from './types';

export class Observable {
  private observers: any[] = [];

  public add(observer: any) {
    this.observers.push(observer);
  }

  public remove(observerToRemove: any) {
    this.observers = this.observers.filter((observer) => observerToRemove !== observer);
  }

  public notify(u: User | null) {
    this.observers.forEach((observer) => observer(u));
  }
}

export const authObserver = new Observable();
