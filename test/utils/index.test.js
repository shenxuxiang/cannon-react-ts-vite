import { describe, it, expect, vi } from 'vitest';
import {
  getType,
  isArray,
  isEmpty,
  extName,
  toFixed,
  isObject,
  objectIs,
  shallowEqual,
  formatRegionCode,
} from '../../src/utils/index';

describe('Test Utils', () => {
  it('to test getType(data)', () => {
    const mockFn = vi.fn(getType);

    mockFn({});
    mockFn('123');
    mockFn(0);
    mockFn(true);

    expect(mockFn.mock.results[0].value).toBe('object');
    expect(mockFn.mock.results[1].value).toBe('string');
    expect(mockFn.mock.results[2].value).toBe('number');
    expect(mockFn.mock.results[3].value).toBe('boolean');
  });

  it('to test isArray(data)', () => {
    const mockFn = vi.fn(isArray);

    mockFn({});
    mockFn([]);
    mockFn(0);

    expect(mockFn.mock.results[0].value).toBeFalsy();
    expect(mockFn.mock.results[1].value).toBeTruthy();
    expect(mockFn.mock.results[2].value).toBeFalsy();
  });

  it('to test isObject(data)', () => {
    const mockFn = vi.fn(isObject);

    mockFn({});
    mockFn([]);
    mockFn(null);
    mockFn('string');

    expect(mockFn.mock.results[0].value).toBeTruthy();
    expect(mockFn.mock.results[1].value).toBeFalsy();
    expect(mockFn.mock.results[2].value).toBeFalsy();
    expect(mockFn.mock.results[2].value).toBeFalsy();
  });

  it('to test isEmpty(data)', () => {
    const mockFn = vi.fn(isEmpty);

    mockFn({});
    mockFn([]);
    mockFn({ a: 1 });
    mockFn([11, 22]);
    mockFn(null);
    mockFn(undefined);


    expect(mockFn.mock.results[0].value).toBeTruthy();
    expect(mockFn.mock.results[1].value).toBeTruthy();
    expect(mockFn.mock.results[2].value).toBeFalsy();
    expect(mockFn.mock.results[3].value).toBeFalsy();
    expect(mockFn.mock.results[4].value).toBeTruthy();
    expect(mockFn.mock.results[5].value).toBeTruthy();
  });

  it('to test extName(data)', () => {
    const mockFn = vi.fn(extName);

    mockFn('/src/components/icon.js');
    mockFn('/src/static/images/1.hash.jpg');
    mockFn();

    expect(mockFn.mock.results[0].value).toBe('js');
    expect(mockFn.mock.results[1].value).toBeTruthy('jpg');
    expect(mockFn.mock.results[2].value).toBe('');
  });


  it('to test objectIs(data)', () => {
    const mockFn = vi.fn(objectIs);

    mockFn(NaN, NaN);
    mockFn(0, -0);
    mockFn(1, 1);
    mockFn(true, true);
    mockFn('123', '123');
    mockFn({}, {});

    expect(mockFn.mock.results[0].value).toBeTruthy();
    expect(mockFn.mock.results[1].value).toBeFalsy();
    expect(mockFn.mock.results[2].value).toBeTruthy();
    expect(mockFn.mock.results[3].value).toBeTruthy();
    expect(mockFn.mock.results[4].value).toBeTruthy();
    expect(mockFn.mock.results[5].value).toBeFalsy();
  });

  it('to test shallowEqual(data)', () => {
    const mockFn = vi.fn(shallowEqual);

    mockFn({}, {});
    mockFn({ name: 'qm', pro: 123 }, { name: 'qm', pro: 123 });
    // 只进行浅比较，所以预期结果是 false
    mockFn([1, 2, 3, { a: 111, b: 222}], [1, 2, 3, { a: 111, b: 222}])

    expect(mockFn.mock.results[0].value).toBeTruthy();
    expect(mockFn.mock.results[1].value).toBeTruthy();
    expect(mockFn.mock.results[2].value).toBeFalsy();
  });

  it('to test toFixed(data)', () => {
    const mockFn = vi.fn(toFixed);

    mockFn(1234567, 2, 10000);
    mockFn(100);

    expect(mockFn.mock.results[0].value).toBe('123.46');
    expect(mockFn.mock.results[1].value).toBe('100.00');
  });


  it('to test formatRegionCode(data)', () => {
    const mockFn = vi.fn(formatRegionCode);

    mockFn('34');
    mockFn('3401');
    mockFn('340102');
    mockFn('340102113');

    expect(mockFn.mock.results[0].value).toEqual(['34']);
    expect(mockFn.mock.results[1].value).toEqual(['34', '3401']);
    expect(mockFn.mock.results[2].value).toEqual(['34', '3401', '340102']);
    expect(mockFn.mock.results[3].value).toEqual(['34', '3401', '340102', '340102113']);
  });
});


