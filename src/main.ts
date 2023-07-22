import { createApp } from 'vue';
import App from './App.vue';
import router from '/@/router';
import store from '/@/store';

import 'vant/lib/index.css';
import './assets/app.scss';

const app = createApp(App);

// 路由
app.use(router);

// 状态管理
app.use(store);

app.mount('#app');
