import { Button } from 'antd';
import React, { memo } from 'react';
import classes from './index.module.less';
import imgURL from '@/assets/images/404.svg';

function Page(props: any) {
  return (
    <div className={classes.page}>
      <img src={imgURL} alt="" className={classes.img} />
      <div>
        <h1 className={classes.title}>UH OH！页面丢失</h1>
        <p className={classes.subtitle}>您所访问的页面不存在，您可以点击下方的按钮，返回主页</p>
        <Button ghost type="primary" className={classes.button} onClick={() => props.navigate(-1)}>
          返回首页
        </Button>
      </div>
    </div>
  );
}

export default memo(Page);
