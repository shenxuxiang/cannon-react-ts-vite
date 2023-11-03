import React, { memo } from 'react';
import classes from './index.module.less';

// 本页面只是一个演示，通过它你能快速上手项目中 reudx 数据模型的使用。
function Page(props: any) {
  return (
    <div className={classes.page}>
      <h2>hellow world Home Page</h2>
    </div>
  );
}

export default memo(Page);
