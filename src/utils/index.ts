import tween, { TweenAttrNames } from './tween';

export function getType(data: any) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

export function isArray<T>(data: any): data is T[] {
  return getType(data) === 'array';
}

export function isObject(data: any): data is object {
  return getType(data) === 'object';
}

export function isMap<K, V>(data: any): data is Map<K, V> {
  return getType(data) === 'map';
}

export function isSet<T>(data: any): data is Set<T> {
  return getType(data) === 'set';
}

export function isEmpty(data: null | undefined | object | Array<any> | Map<any, any> | Set<any>) {
  if (!data) return true;
  if (isArray(data)) {
    return data.length <= 0;
  } else if (isMap(data) || isSet(data)) {
    return data.size <= 0;
  } else {
    const keys = [...Object.getOwnPropertyNames(data), ...Object.getOwnPropertySymbols(data)];
    return keys.length <= 0;
  }
}

/**
 * 获取文件后缀名
 * @param filename 完整的文件名
 * @returns
 */
export function extName(filename: string) {
  if (!filename) return '';

  const idx = filename.lastIndexOf('.');
  if (~idx) return filename.slice(idx + 1);
  return '';
}

/**
 * 下载文件
 * @param fileName 指定文件下载后的文件名
 * @param data     文件资源（blob）
 * @param extName  文件后缀
 */
export function downloadFile(fileName: string, data: any, extName = '.xlsx') {
  const blob = new Blob([data]);
  const eLink = document.createElement('a');
  // <a/> 上的 download 属性用于重命名一个需要下载的文件
  eLink.download = /\.([a-zA-Z]+)$/i.test(fileName) ? fileName : fileName + extName;
  eLink.style.display = 'none';
  eLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eLink);
  eLink.click();
  // 释放 URL 对象
  URL.revokeObjectURL(eLink.href);
  document.body.removeChild(eLink);
}

// 判断两个值是否完全相等，可以比较 +0 !== -0，NaN === NaN
export function objectIs(v1: any, v2: any): boolean {
  if (v1 === 0 && v2 === 0) {
    return 1 / v1 === 1 / v2;
  } else if (v1 !== v1) {
    return v2 !== v2;
  } else {
    return v1 === v2;
  }
}

export function shallowEqual(obj1: any, obj2: any): boolean {
  if (objectIs(obj1, obj2)) return true;

  // 如果 obj1、obj2 有一个不是 object 类型，则返回 false
  // 注意：typeof null === 'object'
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i];
    if (!Object.hasOwn(obj2, key) || !objectIs(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * 防抖
 * @param func        防抖的方法
 * @param delay       防抖的时间间隔
 * @param immediately 是否立即执行 func
 * @returns
 */
export function debounce(func: Function, delay: number, immediately = false) {
  let interval: any = null;
  return function (...args: any[]) {
    if (immediately) {
      if (!interval) func(...args);

      interval && clearTimeout(interval);
      interval = setTimeout(() => (interval = null), delay);
    } else {
      clearTimeout(interval);
      interval = setTimeout(() => func(...args), delay);
    }
  };
}

/**
 * 节流
 * @param func        节流的方法
 * @param delay       节流的时间间隔
 * @param immediately 是否立即执行 func
 * @returns
 */
export function throttle(func: Function, delay: number, immediately = false) {
  let interval: any = null;
  return function (...args: any[]) {
    if (immediately) {
      if (interval) return;
      func(...args);
      interval = setTimeout(() => (interval = null), delay);
    } else {
      if (interval) return;
      interval = setTimeout(() => {
        func(...args);
        interval = null;
      }, delay);
    }
  };
}

/**
 * 页面，元素容器（voerflow 不是 visible）的滚动（动画）
 * @param position       终点位置
 * @param timingFunction 动画曲线
 * @param times          动画执行的次数
 * @param container      目标元素
 */
export function scrollToPosition(
  position: number,
  timingFunction: TweenAttrNames = 'linear',
  times = 50,
  container: HTMLElement = document.documentElement,
) {
  execAnimation(0);

  function execAnimation(count: number) {
    const scrollTop = container.scrollTop;
    let pos = tween[timingFunction](count, scrollTop, position - scrollTop, times);
    container.scrollTop = pos;
    if (pos === position || count >= times) return;
    requestAnimationFrame(() => execAnimation(count + 1));
  }
}

/**
 * 延迟执行函数
 * @param time  延迟执行的的时间
 * @param value 期望得到的值。如果 value 是一个 Error 实例则返回 rejected promise，否则返回 fulfuilled promise
 * @returns
 */
export function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value instanceof Error) {
        reject(value);
      } else {
        resolve(value);
      }
    }, time);
  });
}

export function setLocalStorage(key: string, value: any) {
  if (value === null) {
    window.localStorage.clearItem(key);
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getLocalStorage(key: string) {
  let value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

/**
 * 数字格式化，toFixed(990000000, 10000, 2) => 99000.00(单位：万)
 * @param value   需要计算的数值
 * @param divisor 格式化的单位（万：10000，百万：1000000）
 * @param float   保留的小数
 * @returns
 */
export function toFixed(value: string | number, divisor = 10000, float = 2) {
  if (!value) return '';
  return ((value as number) / divisor).toFixed(float);
}
