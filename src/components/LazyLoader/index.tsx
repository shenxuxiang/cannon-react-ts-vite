import React, { useState, useLayoutEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import store from "@/redux/store";
import { combineReducers } from "redux";
import { reducer } from "@/models/index";
import type { Reducer } from "redux";
import classes from "./index.module.less";

type Loader = () => Promise<{
  default: React.FunctionComponent | React.ComponentClass;
}>;
type Models = { [propName: string]: Reducer };

const { replaceReducer } = store;

export default function LazyLoader(
  loader: Loader,
  models?: Models
): React.FunctionComponent {
  return function (props: any) {
    const [content, setContent] = useState<
      React.FunctionComponent | React.ComponentClass | null
    >(null);
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    useLayoutEffect(() => {
      loader().then((response) => {
        replaceReducer(combineReducers({ main: reducer, ...models }));
        setContent(() => response.default);
      });
    }, []);

    if (content) {
      let Comp = content;
      return (
        <Comp
          {...props}
          params={params}
          location={location}
          navigate={navigate}
        />
      );
    }

    return (
      <div className={classes.loading}>
        <Spin size="large" />
      </div>
    );
  };
}
