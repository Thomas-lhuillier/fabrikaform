<template>
  <div class="home">
    <MainMenu/>

    <div class="px2">
      <h1>Home page</h1>
    </div>
  </div>
</template>

<script>
import MainMenu from "@/components/MainMenu.vue";

export default {
  name: "home",
  components: {
    MainMenu
  }
};
</script>
