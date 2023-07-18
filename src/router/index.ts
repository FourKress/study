import { createRouter, createWebHashHistory, Router } from 'vue-router';
import routes from './routes';
import * as process from "process";
import {useCookies} from "@vueuse/integrations/useCookies";

const { VITE_TOKEN_KEY } = import.meta.env;
const router: Router = createRouter({
  history: createWebHashHistory('/'),
  routes: routes,
});

router.beforeEach(async (_to, _from, next) => {
  const {path} = _to;
  if (path.includes('agent')) {
    const useragent = navigator.userAgent;
    // @ts-ignore
    if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
      window.location.href = `${process.env.NODE_ENV === 'production' ? '' : '/public'}/wxError.html`;
      return;
    }
    const token = useCookies().get(VITE_TOKEN_KEY as string);
    if (!token && path !== '/home') next('/agentRegister');
  }
  next();
});

export default router;
