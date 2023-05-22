/**
 * 该数据模型作为公共数据模型使用，不局限于某一个功能或页面。
 * 该数据模型会自动绑定到每个页面，具体逻辑你可以在 '@/components/LazyLoader' 组件中找到答案。
 * 具体使用场景可以参考 '@/pages/home' 页面的代码。
 * 如果你的页面不使用 redux 进行数据状态管理，可以参考 '@/pages/login' 页面的代码
 * 注意，如果你不使用它请不要删除该文件。
 */

import request from '@/utils/axios';
import type { Dispatch } from 'redux';
import createReducer from '@/redux/createReducer';

export const effects = {};

export const actions = {};

export const reducer = createReducer(actions);
