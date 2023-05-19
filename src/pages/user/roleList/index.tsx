import React, { memo } from 'react';
import classes from './index.module.less';

function Page() {
  return (
    <div className={classes.page}>
      <h1>user list</h1>
    </div>
  );
}
export default memo(Page);
