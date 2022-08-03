<template>
  <Card class="shadow-5">
    <template #content>
      <form @submit="login">
        <div class="inputtext-lg">
          <span class="p-float-label mt-1">
            <InputText id="email" class="min-w-full" :class="invalidLogin ? 'invalid' : ''"
                        type="text" v-model="email" autocomplete="cmedicNo" />
            <label for="email">Correo electrónico</label>

          </span>
          <span class="p-float-label mt-5">
            <Password id="password" v-model="password" class="min-w-full"
                      promptLabel="Nivel de seguridad" inputClass="min-w-full"
                      weakLabel="Débil" mediumLabel="Medio" strongLabel="Segura"
                      :class="invalidLogin ? 'invalid' : ''"/>
            <label for="password">Contraseña</label>
          </span>
        </div>
      </form>
    </template>

    <template #footer>
      <Button label="Ingresar" icon="pi pi-user" class="p-button-raised w-full"
          @click.prevent="login"/>
    </template>
  </Card>
</template>
<script>
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

export default {
  name: 'log-in',
  components: {
    Button,
    Card,
    InputText,
    Password,
  },
  data() {
    return {
      invalidLogin: false,
      email: '',
      password: '',
      passwordFieldType: 'password',
    };
  },
  methods: {
    login() {
      let self = this
      this.$auth
        .login({
          url: '/auth/sign_in',
          params: {
            email: this.email,
            password: this.password,
          },
          redirect: {name: 'content'},
          remember: 'Rob',
          staySignedIn: true,
          fetchUser: false
        }).then((data) => {
          this.$store.dispatch('session/set-authenticated', true);
          this.$store.dispatch('session/set-current-user', data.data);
        }).catch(
          (error) => {
            if (error.response.data) {
              alert('error')
              console.log('this is error')
            }
            self.invalidLogin = true;
          },
        );
    },
  }
};
</script>