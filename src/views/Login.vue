<template>
  <v-card elevation="2" width="50%" class="login-form py-6 pr-10 pl-10">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <validation-provider v-slot="{ errors }" name="Username" rules="required">
          <v-text-field v-model="name" :error-messages="errors" label="Username" required></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="Password" rules="required">
          <v-text-field class="mb-4" v-model="password" :error-messages="errors" type="password" label="Password" required></v-text-field>
        </validation-provider>
        <v-btn class="mr-4" type="submit" color="#3B82F6" :disabled="invalid" :loading="loading">
          submit
        </v-btn>
        <v-btn color="#EF4444" @click="clear">
          clear
        </v-btn>
      </form>
    </validation-observer>
  </v-card>
</template>
<style>
  html {
    overflow: auto;
  }
  .login-form {
    margin : auto;
    margin-top: 15%;
  }
</style>
<script>
import { required } from 'vee-validate/dist/rules'
import axios from 'axios'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { API_URL } from '../config';

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    name: '',
    password: '',
    loading: false
  }),

  methods: {
    submit () {
      this.$refs.observer.validate();
      this.loading = true;
      axios({
        method : "post",
        url : API_URL+"/admin/auth/login",
        data : {
          username : this.name,
          password : this.password
        }
      }).then((res) => {
        let { data } = res;
        localStorage.setItem('token', `${data.tkn}`);
        this.loading = false;
        return this.$router.push({ name: 'Home' });
      }).catch(() => {
        console.log('Bah non tu es pas admin');
        this.loading = false;
      })
    },
    clear () {
      this.name = ''
      this.email = ''
      this.$refs.observer.reset()
    },
  },
}
</script>