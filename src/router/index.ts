import { createRouter, createWebHashHistory, Router } from 'vue-router';
import routes from './routes';
import { getUrlParams2 } from '/@/utils';
import { wechatBinding } from '/@/api';
import { useUserStore } from '/@/store/modules/user';
import { useCookies } from '@vueuse/integrations/useCookies';

const { VITE_TOKEN_KEY } = import.meta.env;
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
    if (['/home', '/agentRegister'].includes(path)) return next();

    const token = useCookies().get(VITE_TOKEN_KEY as string);
    const { code = '' } = getUrlParams2(window.location.href);
    if (!token && code) {
      const res = await wechatBinding({ code });

      const { token, status, mobile, openId } = res.data.value || {};

      sessionStorage.setItem('tempKey', openId);

      // 未认证
      if (!mobile) {
        return next('/agentRegister');
      }
      token && userStore.setToken(token);
      userStore.setInfo({
        mobile,
        status: status === 'BIND_MOBILE',
      });
    }
  }
  next();
});

export default router;
