import { setupWorker } from 'msw/browser';
import loginAdmin from './v1.0-login-admin';
import sysUserInfo from './v1.0-sysUser-info';
import homeTableList from './v1.0-home-table-list';
import systemRoleList from './v1.0-system-role-list';

export default async function workServer() {
  const worker = setupWorker(loginAdmin(), sysUserInfo(), homeTableList(), systemRoleList());
  await worker.start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
    onUnhandledRequest: 'bypass',
  });

  return worker.stop;
}
