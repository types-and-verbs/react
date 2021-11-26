/* tslint:disable */
import { BaseItem, Observer, ObserverMessage } from './types';

class Observable {
  private observers: [] = [];

  addObserver<I extends BaseItem>(topic: string, observer: Observer<I>) {
    // @ts-ignore
    this.observers[topic] || (this.observers[topic] = []);

    // @ts-ignore
    this.observers[topic].push(observer);
  }

  removeObserver<I extends BaseItem>(topic: string, observer: Observer<I>) {
    // @ts-ignore
    if (!this.observers[topic]) return;

    // @ts-ignore
    const index = this.observers[topic].indexOf(observer);

    if (~index) {
      // @ts-ignore
      this.observers[topic].splice(index, 1);
    }
  }

  notifyObservers<I extends BaseItem>(topic: string, message: ObserverMessage<I>) {
    // @ts-ignore
    if (!this.observers[topic]) return;

    // @ts-ignore
    for (let i = this.observers[topic].length - 1; i >= 0; i--) {
      // @ts-ignore
      this.observers[topic][i](message);
    }
  }
}

export const observable = new Observable();
