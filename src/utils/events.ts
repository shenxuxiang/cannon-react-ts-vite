interface Listeners {
  [propsName: string]: Array<Function>;
}

export class EventEmitter {
  public listeners: Listeners;
  constructor() {
    this.listeners = {};
  }

  emit(type: string, ...args: Array<any>) {
    const fns = this.listeners[type];
    if (!fns || fns.length === 0) return;
    for (let i = 0; i < fns.length; i++) {
      fns[i].apply(this, args);
    }
  }

  add(type: string, fn: Function) {
    let fns = this.listeners[type];
    if (!fns) this.listeners[type] = fns = [];
    fns.push(fn);
  }

  remove(type: string, fn?: Function) {
    const fns = this.listeners[type];
    if (!fns || fns.length <= 0) return;
    if (typeof fn === 'undefined') {
      fns.length = 0;
      return;
    } else {
      const index = fns.indexOf(fn);
      fns.splice(index, 1);
    }
  }
}

export default new EventEmitter();
