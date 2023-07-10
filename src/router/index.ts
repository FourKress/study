import { createRouter, createWebHashHistory, Router } from 'vue-router';
import routes from './routes';

const router: Router = createRouter({
  history: createWebHashHistory('/'),
  routes: routes,
});

router.beforeEach(async (_to, _from, next) => {
  // const {path} = _to;
  // if (path.includes('agent')) {
  //   const useragent = navigator.userAgent;
  //   // @ts-ignore
  //   if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
  //     window.location.href = "/static/wxError.html";
  //   }
  //   return next(false);
  // }
  next();
});

export default router;
