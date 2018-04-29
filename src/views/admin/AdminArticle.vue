<template>
  <div class="admin-article">
    <AdminMenu/>

    <div class="container">
      <section class="row mt-4">
        <div class="col-8">
          <!-- Article block -->
          <b-form v-on:submit.prevent="save" >
            <b-form-group label="Title" label-for="articleTitle">
              <b-form-input v-model="article.title"
                            id="articleTitle"
                            type="text"
                            placeholder="title">
              </b-form-input>
            </b-form-group>

            <b-form-group label="Description" label-for="articleDescription">
              <b-form-textarea v-model="article.description"
                               id="articleDescription"
                               :rows="3"
                               :max-rows="6"
                               placeholder="decription">
              </b-form-textarea>
            </b-form-group>

            <div class="left-align">
              <b-button type="submit" variant="primary">Publish</b-button>
              <b-button v-on:click="$router.go(-1)" variant="outline-warning" class="ml-2">Cancel</b-button>
            </div>
          </b-form>
        </div>

        <div class="col-4">
          <ArticleImages v-bind:articleId="articleId"></ArticleImages>
        </div>

      </section>
    </div>
  </div>
</template>

<script>
import AdminMenu from "@/components/admin/Menu.vue";
import ArticleImages from "@/components/admin/ArticleImages.vue";
import {db, storage} from "../../firebase";

const articlesRef = db.ref('articles');

export default {
  name: "adminArticle",
  components: {
    AdminMenu,
    ArticleImages
  },
  firebase: {
    articles: db.ref('articles'),
  },
  props: {
    'articleId': {
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      article: {
        title: '',
        description: ''
      }
    }
  },
  created() {
    if (this.articleId) {
      this.bindExistingArticle(this.articleId);
    }
  },
  methods: {
    bindExistingArticle(id) {
      this.$bindAsObject('article', articlesRef.child(id));
    },
    save() {
      if (this.title === '') { return };

      (this.articleId) ?
        this.updateArticle() : this.addArticle();
    },
    addArticle() {
      this.$firebaseRefs.articles.push(this.article)
        .then(() => {
          this.$router.push({name: 'admin'});
        });
    },
    updateArticle() {
      const copy = {...this.article};
      delete copy['.key'];
      this.$firebaseRefs.articles.child(this.articleId).set(copy)
        .then(() => {
          this.$router.push({name: 'admin'});
        });
    }
  }
}
</script>
