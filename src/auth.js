import {createAuth}          from '@websanova/vue-auth/src/v3.js';
import driverAuthDevise      from '@websanova/vue-auth/dist/drivers/auth/devise.esm.js';
import driverHttpAxios       from '@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js';
import driverRouterVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js';

const instance = function (app) {
  app.use(createAuth({
    plugins: {
      http: app.axios,
      router: app.router,
    },
    drivers: {
      auth: driverAuthDevise,
      http: driverHttpAxios,
      router: driverRouterVueRouter,
    },
    options: {
      rolesKey: 'type',
      notFoundRedirect: {name: 'user-account'},
      fetchData: {url: 'base/user_data', method: 'GET', enabled: false},
      refreshData: {url: 'user_token/', method: 'GET', enabled: false, interval: 0}
    }
  }));
}

export default instance
