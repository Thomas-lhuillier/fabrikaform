<template>
  <div class="admin">
    <AdminMenu/>

    <div class="container pt-4">
      <div class="mb-2">
        <h1>Admin dashboard</h1>
        Hello {{email}}
      </div>

      <ArticlesList></ArticlesList>
    </div>
  </div>
</template>

<script>
import AdminMenu from "@/components/admin/Menu.vue";
import ArticlesList from "@/components/admin/ArticlesList.vue";

export default {
  name: "admin",
  components: {
    AdminMenu,
    ArticlesList
  },

  data: function() {
    return {
      name: '',
      email: ''
    }
  },

  created: function() {
    let user = this.$store.getters.getUser;
    if (user) {
      this.name = user.displayName;
      this.email = user.email;
    }
  },
}
</script>
