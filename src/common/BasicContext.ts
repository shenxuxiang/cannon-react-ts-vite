import { createContext, useContext } from 'react';
import type { MenuItem } from '@/routers';

type BasicContextType = {
  basic: {
    userMenuItems: MenuItem[];
    userInfo: { [propName: string]: any };
    userPermissions: Map<string, { path: string; name: string }>;
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
