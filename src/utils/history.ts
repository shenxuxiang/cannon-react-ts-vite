import { createBrowserHistory } from 'history';

const history = createBrowserHistory({ window });

/**
 * 路径格式化（拼接 baseURL）
 * @param pathname string
 * @returns
 */
function pathResolve(pathname: string) {
  let base = import.meta.env.BASE_URL;

  if (base.endsWith('/')) base = base.slice(0, -1);

  if (!pathname) {
    pathname = '/';
  } else if (!pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }

  return base + pathname;
}

function historyPush(url: string) {
  history.push(pathResolve(url));
}

function historyReplace(url: string) {
  history.replace(pathResolve(url));
}

export { history as default, historyPush, historyReplace, pathResolve };
