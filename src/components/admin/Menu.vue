<template>
  <b-nav class="px2 mxn1 mb2 bg-dark text-white clearfix">
    <b-link :to="{name: 'admin'}" class="btn btn-dark btn-sm" exact>Dashboard</b-link>
    <div v-if="user" class="ml-auto text-muted">
      <b-link :to="{name: 'home'}" class="btn btn-dark btn-sm" exact>Site</b-link>
      <span class="small align-middle p-2">{{user.email}}</span>
      <b-button v-on:click="signOut" size="sm" variant="dark">Sign out</b-button>
    </div>
  </b-nav>

</template>

<script>
export default {
  name: "AdminMenu",
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    signOut: function() {
      this.$store.dispatch('signOut').then(() => {
        this.$router.replace({name: 'login'});
      });
    }
  },
}
</script>
