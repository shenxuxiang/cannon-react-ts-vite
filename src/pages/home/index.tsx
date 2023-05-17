import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import type { Dispatch } from "redux";
import { actions } from "@/models/home";
import classes from "./index.module.less";

const mapStateFromProps = (state: any) => {
  return state.home;
};

const mapDispatchFromProps = (dispatch: Dispatch) => {
  return bindActionCreators(actions, dispatch);
};

// 本页面只是一个演示，通过它你能快速上手项目中 reudx 数据模型的使用。
function Page(props: any) {
  useEffect(() => {
    props.getMenuSource({}).then((data: any) => {
      // 你可以在这里获取数据，可以直接通过 props.menuSource.
      console.log(data, "menuSource");
    });
  }, []);

  return (
    <div className={classes.page}>
      <h2>hellow world Home Page</h2>
      {props?.menuSource?.map((item: any) => (
        <h3 key={item.path}>{item.path}</h3>
      ))}
    </div>
  );
}

export default memo(connect(mapStateFromProps, mapDispatchFromProps)(Page));
