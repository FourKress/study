export const routes = [
  {
    path: '/agentHome',
    name: 'agentHome',
    component: () => import('/@/layout/index.vue'),
    meta: {
      hasTabbar: false,
      notNavbar: true,
      title: '',
    },
    children: [
      {
        path: '/order',
        name: 'Order',
        component: () => import('/@/views/order/index.vue'),
        meta: {
          hasTabbar: false,
          title: '我的报告',
          notNavbar: false,
        },
      },
      {
        path: '/agentProduct',
        name: 'AgentProduct',
        component: () => import('/@/views/agent-product/index.vue'),
        meta: {
          title: '代理产品',
          hasTabbar: true,
          notNavbar: false,
        },
      },
      {
        path: '/agentReport',
        name: 'AgentReport',
        component: () => import('/@/views/agent-report/index.vue'),
        meta: {
          title: '可阅报告',
          hasTabbar: true,
          notNavbar: false,
        },
      },
      {
        path: '/agentIncome',
        name: 'AgentIncome',
        component: () => import('/@/views/agent-income/index.vue'),
        meta: {
          title: '我的收益',
          hasTabbar: true,
          notNavbar: false,
        },
      },
      {
        path: '/agentIncomeDetails',
        name: 'AgentIncomeDetails',
        component: () => import('/@/views/agent-income/details.vue'),
        meta: {
          title: '收益明细',
          hasTabbar: false,
          notNavbar: false,
        },
      },
      {
        path: '/agentUser',
        name: 'AgentUser',
        component: () => import('/@/views/user/index.vue'),
        meta: {
          title: '我的',
          hasTabbar: true,
          notNavbar: false,
        },
      },
      {
        path: '/agentOrder',
        name: 'AgentOrder',
        component: () => import('/@/views/agent-order/index.vue'),
        meta: {
          title: '我的订单',
          hasTabbar: false,
          notNavbar: false,
        },
      },
      {
        path: '/reportDetails',
        name: 'ReportDetails',
        component: () => import('/@/views/agent-report/details.vue'),
        meta: {
          hasTabbar: false,
          title: '报告详情',
          notNavbar: false,
        },
      },
    ],
  },
  {
    path: '/',
    name: 'Register',
    component: () => import('/@/views/register/index.vue'),
  },
  {
    path: '/agentRegister',
    name: 'AgentRegister',
    component: () => import('/@/views/agent-register/index.vue'),
  },

  // 匹配不到重定向会主页
  {
    // 找不到路由重定向到 404 页面
    path: '/:pathMatch(.*)',
    redirect: '/',
  },
];

export default routes;
