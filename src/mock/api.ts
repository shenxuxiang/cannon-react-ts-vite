import loginAdmin from './v1.0-login-admin';
import sysUserInfo from './v1.0-sysUser-info';
import homeTableList from './v1.0-home-table-list';
import systemRoleList from './v1.0-system-role-list';

export default [loginAdmin(), sysUserInfo(), homeTableList(), systemRoleList()];
