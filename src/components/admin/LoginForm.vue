<template>
  <div class="login-form">
    <form v-on:submit.prevent="login">
      <h3>
        Sign in
      </h3>
      <input v-model="email" type="text" placeholder="Email">
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Sign in</button>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'loginForm',
  data: function() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login: function() {
      let app = this;
      let userInfo = {
        email: this.email,
        password: this.password
      };
      this.$store.dispatch('signIn', userInfo).then(
        () => {
          this.$router.replace({name: 'admin'});
        },
        (err) => {
          alert(err);
        }
      );
    },
  }
}
</script>
