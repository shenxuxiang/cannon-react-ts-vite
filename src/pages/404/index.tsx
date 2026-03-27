import { Button } from 'antd';
import { useModel } from '@/redux';
import classes from './index.module.less';
import { memo, useCallback } from 'react';
import NotFoundSvg from '@/assets/images/404.svg?react';
function Page(props: any) {
  const { navigate } = props;
  const { homeURL } = useModel('main');

  const goHome = useCallback(() => {
    if (homeURL) {
      navigate(homeURL);
    } else {
      navigate('/login');
    }
  }, [homeURL, navigate]);

  return (
    <div className={classes.page}>
      {/* 重置了高度，就可以根据 width 实现自适应 */}
      <NotFoundSvg width="50%" height="" />
      <div>
        <h1 className={classes.title}>UH OH！页面丢失</h1>
        <p className={classes.subtitle}>您所访问的页面不存在，您可以点击下方的按钮，返回主页</p>
        <Button ghost type="primary" className={classes.button} onClick={goHome}>
          返回首页
        </Button>
      </div>
    </div>
  );
}

export default memo(Page);
