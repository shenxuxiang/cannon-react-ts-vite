import { createContext, useContext } from 'react';
import type { MenuItem } from '@/routers';

<<<<<<< HEAD
// Context 初始化数据类型
type BasicContextInitialDataType = {
  homeURL: string | null;
  userMenuItems: MenuItem[];
  userInfo: { [propName: string]: any };
  userPermissions: Map<string, { path: string; name: string }>;
  [propName: string]: any;
};

// Context 初始化数据，可以在下面添加任意不重复的属性
export const BASIC_CONTEXT_INITIAL_DATA: BasicContextInitialDataType = {
  homeURL: '',
  userInfo: {},
  userMenuItems: [],
  userPermissions: new Map(),
};

export type BasicContextType = {
  context: BasicContextInitialDataType;
  updateContext: (state: Partial<BasicContextInitialDataType>) => void;
};

export const BasicContext = createContext<BasicContextType>({
  context: BASIC_CONTEXT_INITIAL_DATA,
  updateContext: () => {},
});

export { BasicContext as default };

export const useBasicContext = () => useContext(BasicContext);
=======
type BasicContextType = {
  basic: {
    userMenuItems: MenuItem[];
    userInfo: { [propName: string]: any };
    userPermissions: Map<string, { path: string; name: string }>;
    [propName: string]: any;
  };
  update: (value: any) => any;
};

const BasicContext = createContext<BasicContextType>({
  basic: {
    userInfo: {},
    userMenuItems: [],
    userPermissions: new Map(),
  },
  update: () => {},
});

const useBasicContext = () => useContext(BasicContext);

export { BasicContext as default, useBasicContext };
>>>>>>> f8bdc9e (feat: update)
