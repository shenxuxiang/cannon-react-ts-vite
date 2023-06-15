import React, { memo } from 'react';
import classes from './index.module.less';

function Page(props: any) {
  return (
    <div className={classes.page}>
      <h2>hellow world Home Page</h2>
    </div>
  );
}

export default memo(Page);
