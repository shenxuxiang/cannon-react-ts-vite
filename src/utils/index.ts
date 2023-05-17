import tween, { TweenAttrNames } from "./tween";
export { default as axios } from "./axios";
export { default as events } from "./events";
export { default as PrintPDF } from "./printPDF";
export { default as useReducer } from "./useReducer";
export { default as downLoadFile } from "./download";

export function getType(data: any) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

export function isArray<T>(data: any): data is T[] {
  return getType(data) === "array";
}

export function isObject(data: any): data is object {
  return getType(data) === "object";
}

export function isMap<K, V>(data: any): data is Map<K, V> {
  return getType(data) === "map";
}

export function isSet<T>(data: any): data is Set<T> {
  return getType(data) === "set";
}

export function isPlainObject(data: any) {
  if (typeof data !== "object" || !data) return false;

  const proto = Object.getPrototypeOf(data);
  if (Object.getPrototypeOf(proto) === null) return true;
  let _proto = proto;
  while (Object.getPrototypeOf(_proto)) {
    _proto = Object.getPrototypeOf(_proto);
  }
  return _proto === proto;
}

export function isEmpty(
  data: null | undefined | object | Array<any> | Map<any, any> | Set<any>
) {
  if (!data) return true;
  if (isArray(data)) {
    return data.length <= 0;
  } else if (isMap(data) || isSet(data)) {
    return data.size <= 0;
  } else {
    const keys = [
      ...Object.getOwnPropertyNames(data),
      ...Object.getOwnPropertySymbols(data),
    ];
    return keys.length <= 0;
  }
}

// 获取文件后缀
export function extName(filename: string) {
  if (!filename) return "";

  const idx = filename.lastIndexOf(".");
  if (~idx) return filename.slice(idx + 1);
  return "";
}

/**
 * 浅比较
 * @param obj1
 * @param obj2
 * @returns ture or false
 */
export const shollawEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) {
    return true;
  }

  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

/**
 * 防抖
 * @param func
 * @param delay
 */
export const debounce = <T extends object>(func: Function, delay: number) => {
  let task: any = null;
  return (args: T) => {
    if (task) {
      clearTimeout(task);
    }
    task = setTimeout(() => {
      func(args);
    }, delay);
  };
};
/**
 * 节流
 * @param func
 * @param delay
 */
export const throttle = <T extends object>(func: Function, delay: number) => {
  let task: any = null;
  return (args: T) => {
    if (!task) {
      task = setTimeout(() => {
        task = null;
        func(args);
      }, delay);
    }
  };
};

/**
 * @params { endPosition }    终点位置
 * @params { timingFunction } 动画曲线
 * @params { timer }          动画执行的次数
 * @params { element }        目标元素
 */
export const scrollToTargetPosition = (
  endPosition: number,
  timingFunction: TweenAttrNames = "linear",
  timer = 50,
  element: HTMLElement = document.documentElement
) => {
  execAnimation(0);

  function execAnimation(count: number) {
    const scrollTop = element.scrollTop;
    let pos = tween[timingFunction](
      count,
      scrollTop,
      endPosition - scrollTop,
      timer
    );
    element.scrollTop = pos;

    if (count + 1 < timer)
      requestAnimationFrame(() => execAnimation(count + 1));
  }
};
// 延迟
export function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), time);
  });
}

export function setLocalStorage(key: string, value: any) {
  if (!value) {
    window.localStorage.clearItem(key);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage(key: string) {
  let value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : value;
}

export function toFixed(value: string | number, divisor = 10000, float = 2) {
  if (!value) return 0;
  if (typeof value === "string") value = Number(value);
  const sum = (value / divisor).toFixed(float);
  return Number(sum);
}
