import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { firebase } from './firebase';
import VueFire from 'vuefire';
import BootstrapVue from 'bootstrap-vue';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

Vue.component('icon', Icon);
Vue.use(VueFire);
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(function() {
  store.dispatch('setUser');

  if (!app) {
    app = new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});
