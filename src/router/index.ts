import { createRouter, createWebHashHistory, Router } from 'vue-router';
import routes from './routes';
import { getUrlParams2 } from '/@/utils';
import { wechatBinding } from '/@/api';
import { useUserStore } from '/@/store/modules/user';

const router: Router = createRouter({
  history: createWebHashHistory('/'),
  routes: routes,
});

router.beforeEach(async (_to, _from, next) => {
  const userStore = useUserStore();
  const { path } = _to;
  if (path.includes('agent')) {
    const useragent = navigator.userAgent;
    // @ts-ignore
    if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
      window.location.href = `${process.env.NODE_ENV === 'production' ? '' : '/public'}/wxError.html`;
      return;
    }
    if (['/agentHome', '/agentRegister'].includes(path)) return next();

    const appUser = userStore.info;
    const { code = '' } = getUrlParams2(window.location.href);
    if (code && !appUser.mobile) {
      const res = await wechatBinding({ code });
      const { token, status, mobile, openId } = res.data.value || {};

      sessionStorage.setItem('tempKey', openId);

      const isBind = status === 'BIND_MOBILE';
      // 未认证
      if (!mobile || !isBind) {
        return next('/agentRegister');
      }
      token && userStore.setToken(token);
      userStore.setInfo({
        mobile,
        status: isBind,
      });
    }
  }
  next();
});

export default router;
