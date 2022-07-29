<template>
  <Menubar :model="elements">
  </Menubar>
</template>
<script>
import Menubar from 'primevue/menubar';
import { mapGetters } from 'vuex';
export default {
  name: 'cmedic-navbar',
  components: {
    Menubar
  },
  data: () => ({
    elements: [],
  }),
  created() {
    this.setMenuModel();
  },
  methods: {
    setMenuModel() {
      this.elements = [
        {
          label: 'Home',
          command: () => {
            this.goTo('index');
          },
          visible: true,
          icon: 'pi pi-fw pi-home',
        },
        {
          label: 'Iniciar sesion',
          command: () => {
            this.goTo('login');
          },
          visible: !this.$auth.check(),
          icon: 'pi pi-fw pi-sign-in',
        },
        {
          label: 'Content',
          command: () => {
            this.goTo('content');
          },
          visible: this.$auth.check(),
          icon: 'pi pi-fw pi-folder-open',
        },
        {
          label: 'Cerrar session',
          command: () => {
            this.logout();
          },
          visible: this.$auth.check()
        }
      ];
    },
    clearLocalStorage() {
      const clear = () => localStorage.clear();
      setTimeout(clear, 1000);
    },
    goTo(link, data = {}) {
      if (link === this.$route.name) return;
      this.$router.push({ name: link, params: data });
    },
    logout() {
      this.$auth
        .logout({
          url: 'auth/sign_out',
          method: 'DELETE',
          makeRequest: true,
          redirect: '/login',
        });
    },
  },
  computed: {
    ...mapGetters({
      hasSubscription: 'session/hasSubscription'
    }),
  },
  watch: {
    '$route'() {
      this.setMenuModel();
    },
  },
};
</script>
