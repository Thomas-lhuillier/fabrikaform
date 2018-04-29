import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: false,
    uploadingFiles: []
  },
  getters: {
    user: state => state.user,
    UploadingFiles: state => state.uploadingFiles,
    UploadingFilesByArticle: (state, payload) => {
      return state.uploadingFiles.filter(
        file => file.articleID === payload.articleID
      );
    }
  },
  mutations: {
    SET_USER: state => {
      state.user = firebase.auth().currentUser;
    },
    ADD_UPLOADING_FILE: (state, payload) => {
      state.uploadingFiles.push(payload.originalFile);
    },
    REMOVE_UPLOADING_FILE: (state, index) => {
      state.uploadingFiles.splice(index, 1);
    }
  },
  actions: {
    setUser: state => {
      state.commit('SET_USER');
    },
    signIn: (state, payload) => {
      return new Promise((resolve, reject) => {
        firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then(
            () => {
              state.commit('SET_USER');
              resolve();
            },
            err => {
              // @TODO notice user
              reject(err);
            }
          );
      });
    },
    signOut: state => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          state.commit('SET_USER');
        });
    }
  }
});
