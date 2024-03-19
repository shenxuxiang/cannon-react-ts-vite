import { getMenuItems, getHomeURL, getUserPermissions } from '@/routers';
import { BASIC_CONTEXT_INITIAL_DATA } from '@/common/BasicContext';
import type { BasicContextType } from '@/common/BasicContext';
import { isEmpty } from '@/utils';

/**
 * updateBasicContext() 返回一个 update 函数，用来更新 BasicContext。
 * @param updateState 更新 Context 上下文的函数，在 <App /> 中使用 setState 函数代替。
 * @returns
 */
export default function updateBasicContext(updateState: BasicContextType['updateContext']) {
  // options 设计成对象的形式，方便后期的扩展。
  return function update(data: Partial<BasicContextType['context']>) {
    // 如果 data 为 undefined、null、或 {} 则直接返回初始化的数据。
    if (isEmpty(data)) return updateState(BASIC_CONTEXT_INITIAL_DATA);

    // 初始化数据
    const { userInfo, ...rest } = data;
    const init = { ...rest };

    if (!isEmpty(userInfo)) {
      init.userInfo = userInfo;
      // resourceTree 为用户路由权限
      const { resourceTree } = userInfo;
      // 用户访问页面权限
      init.userPermissions = getUserPermissions(resourceTree || []);
      // 用户菜单列表
      init.userMenuItems = getMenuItems(init.userPermissions);
      // 网站首页 URL
      init.homeURL = getHomeURL(init.userMenuItems);
    }

    updateState(init);
  };
}
