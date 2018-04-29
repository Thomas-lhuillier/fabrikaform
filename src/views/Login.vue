<template>
  <div class="login">
    <AdminMenu/>

    <LoginForm/>
  </div>
</template>

<script>
import AdminMenu from "@/components/admin/Menu.vue";
import LoginForm from "@/components/admin/LoginForm.vue";

export default {
  name: "home",
  components: {
    AdminMenu,
    LoginForm
  }
}
</script>