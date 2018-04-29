<template>
  <div class="px2 mxn1 mb2 bg-white clearfix">
    <router-link to="/" class="btn btn-narrow">Home</router-link>
    <router-link to="/projects" class="btn btn-narrow">Projects</router-link>
    <router-link to="/contact" class="btn btn-narrow">Contact</router-link>
    <router-link to="/admin" class="right btn btn-narrow gray">Admin</router-link>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  }
};
</script>
