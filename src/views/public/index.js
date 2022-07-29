import Home from './views/Index.vue';

const routes = [
  {
    path: '/',
    component: Home,
    name: 'index',
  },
  {
    path: '/login',
    component: () => import('@/views/public/views/Login.vue'),
    name: 'login',
  },
];

export default routes;
