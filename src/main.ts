import { createApp } from 'vue';
import App from './App.vue';
import router from '/@/router';
import store from '/@/store';

import { getUrlParams2 } from '/@/utils';
import { useCookies } from '@vueuse/integrations/useCookies';

import 'vant/lib/index.css';
import './assets/app.scss';

const { VITE_TOKEN_KEY } = import.meta.env;

const { code = '' } = getUrlParams2(window.location.href);
if (code) {
  useCookies().remove(VITE_TOKEN_KEY as string);
}

const app = createApp(App);

// 路由
app.use(router);

// 状态管理
app.use(store);

app.mount('#app');
