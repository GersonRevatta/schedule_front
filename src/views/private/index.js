const Content = () => import('@/views/private/views/Index.vue');

const routes = [
  {
    path: '/content',
    component: Content,
    name: 'content',
  }
];

export default routes.map(r => {
  if (!r.meta) r.meta = {}
  r.meta["auth"] = true
  return r
})
