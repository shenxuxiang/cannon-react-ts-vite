import React, { PureComponent } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import JSSHA from "jssha";
import logoUrl from "@/assets/images/logo.png";
import classes from "./index.module.less";
import { signIn, updatePassword } from "@/models/login";
import { setLocalStorage } from "@/utils";
import huangshan from "@/assets/images/huangshan.mp4";

const { Item: FormItem } = Form;

export default class extends PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      spinning: false,
      updatePassword: props.params.status === "passwd",
    };
  }

  encrypto = (value: string) => {
    const hash = new JSSHA("SHA-512", "TEXT", { encoding: "UTF8" });
    hash.update(value);
    return hash.getHash("HEX");
  };

  handleNavigateBack = () => {
    const { location, navigate } = this.props;
    // 先查看 location.search 上是否有重定向的需要。
    const matched = /\??redirect=([^&#]+)/.exec(location.search);
    if (matched) {
      // 需要先解码，然后在进行重定向（回到原先的那个页面）。
      this.props.navigate(`${decodeURIComponent(matched[1])}`);
    } else {
      // 否则，直接回到目录首页。在 MainLayout 组件中，我们对 pathname === '/' 做了逻辑判断。
      navigate("/");
    }
  };

  handleFormFinish = (values: any) => {
    // 修改密码
    if (this.state.updatePassword) {
      const { oldPassword, newPassword, confirmPassword } = values;
      if (oldPassword === newPassword) {
        message.warning("新密码与旧密码不能一样");
        return;
      } else if (newPassword !== confirmPassword) {
        message.warning("请确认新密码与确认密码是否一致");
        return;
      }
      this.setState({ spinning: true });
      const params = {
        oldPassword: this.encrypto(oldPassword),
        newPassword: this.encrypto(newPassword),
        confirmPassword: this.encrypto(confirmPassword),
      };
      updatePassword(params)
        .then((res: any) => {
          if (res.code === 0) {
            message.success("密码修改成功");
            this.props.navigate("/login");
            this.setState({ updatePassword: false });
          } else {
            message.success("密码修改成功");
          }
        })
        .finally(() => this.setState({ spinning: false }));
    } else {
      // 用户登录
      this.setState({ spinning: true });
      const params = {
        username: values.username,
        password: this.encrypto(values.password),
      };
      signIn(params)
        .then((response: any) => {
          const { data, code, message: msg } = response;
          if (code === 0) {
            const { token } = data;
            console.log(token, "token");
            message.success("登录成功");
            setLocalStorage("USER_INFO", data);
            setLocalStorage("TOKEN", token);
            this.handleNavigateBack();
          } else {
            throw new Error(msg);
          }
        })
        .catch((err) => message.error(err.message))
        .finally(() => this.setState({ spinning: false }));
    }
  };

  render() {
    return (
      <div className={classes.page}>
        <Spin
          size="large"
          className={classes.loading}
          spinning={this.state.spinning}
        />
        <video className={classes.video_bg} autoPlay loop muted>
          <source src={huangshan} type="video/mp4" />
        </video>
        <div
          className={classes.page_x}
          style={{ height: this.state.updatePassword ? 440 : 380 }}
        >
          <div className={classes.page_x_header}>
            <img alt="logo" src={logoUrl} className={classes.logo} />
            <div className={classes.page_x_header_title}>
              <div className={classes.page_x_header_title_text}>
                大黄山中台系统
              </div>
              <div className={classes.page_x_header_title_subtext}>
                Mount Huangshan Middle Platform System
              </div>
            </div>
          </div>
          {this.state.updatePassword ? (
            <Form
              wrapperCol={{ offset: 8, span: 8 }}
              onFinish={this.handleFormFinish}
            >
              <FormItem
                name="oldPassword"
                rules={[
                  { required: true, message: "请输入旧密码!" },
                  {
                    pattern: /^[\w-[\](){}|!#^$,.;:'"/\\*?+@%&><]{5,17}$/,
                    message: "密码为包含6-18个字符的字符串",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder="请输入旧密码"
                  prefix={<LockOutlined />}
                />
              </FormItem>
              <FormItem
                name="newPassword"
                rules={[
                  { required: true, message: "请输入新密码!" },
                  {
                    pattern: /^[\w-[\](){}|!#^$,.;:'"/\\*?+@%&><]{5,17}$/,
                    message: "密码为包含6-18个字符的字符串",
                  },
                ]}
                style={{ marginTop: 40 }}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder="请输入新密码"
                  prefix={<LockOutlined />}
                />
              </FormItem>
              <FormItem
                name="confirmPassword"
                rules={[
                  { required: true, message: "确认密码!" },
                  {
                    pattern: /^[\w-[\](){}|!#^$,.;:'"/\\*?+@%&><]{5,17}$/,
                    message: "密码为包含6-18个字符的字符串",
                  },
                ]}
                style={{ marginTop: 40 }}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder="确认密码"
                  prefix={<LockOutlined />}
                />
              </FormItem>
              <FormItem style={{ textAlign: "center", marginTop: 40 }}>
                <Button
                  style={{ width: 120 }}
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  确认修改
                </Button>
              </FormItem>
            </Form>
          ) : (
            <Form
              wrapperCol={{ offset: 8, span: 8 }}
              onFinish={this.handleFormFinish}
            >
              <FormItem
                name="username"
                rules={[
                  { required: true, message: "请输入用户名!" },
                  {
                    pattern: /^[a-zA-Z]\w+$/,
                    message:
                      "用户名必须以大写或小写字母开头，可以包含（数字、字母、下划线）",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="请输入以字母开头的用户名"
                />
              </FormItem>
              <FormItem
                name="password"
                rules={[
                  { required: true, message: "请输入密码!" },
                  {
                    pattern: /^[\w-[\](){}|!#^$,.;:'"/\\*?+@%&><]{5,17}$/,
                    message: "密码为包含6-18个字符的字符串",
                  },
                ]}
                style={{ marginTop: 40 }}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder="请输入密码"
                  prefix={<LockOutlined />}
                />
              </FormItem>
              <FormItem style={{ textAlign: "center", marginTop: 40 }}>
                <Button
                  style={{ width: 120 }}
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  登 录
                </Button>
              </FormItem>
            </Form>
          )}
        </div>
        <div className={classes.footer}>
          技术支持单位：安徽阡陌网络科技有限公司
        </div>
      </div>
    );
  }
}
