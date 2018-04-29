<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~bootstrap-vue/dist/bootstrap-vue.css';

  .btn-action {
    padding: 0.175rem 0.45rem;
    color: gray ;
    background-color: transparent;
    border: none;

    > svg {
      margin-bottom: -2px;
    }
  }

  .btn-remove {
    &:hover {
      background-color: tomato;
    }
  }
</style>
