<template>
  <div class="articles-list rounded border my-4">
    <!-- Nav -->
    <b-navbar type="light" toggleable="md" variant="light">
      <!-- Nav left part -->
      <b-navbar-brand>Articles</b-navbar-brand>

      <b-navbar-nav>
        <b-button :to="{name: 'new-article'}" size="sm" variant="primary">New article</b-button>
      </b-navbar-nav>

      <!-- Nav right part -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="name or category"/>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>

        <b-nav-item-dropdown text="Order by" right class="p-0">
          <b-dropdown-item href="#">date /\</b-dropdown-item>
          <b-dropdown-item href="#">date \/</b-dropdown-item>
        </b-nav-item-dropdown>

      </b-navbar-nav>
    </b-navbar>

    <!-- Articles list -->
    <div class="p-3">
      <ul class="list-reset">
        <li v-for="article in reverseArticles" :key="article['.key']">
          {{article.title}}
          <b-link :to="{name: 'edit-article', params: {articleId: article['.key']}}">edit</b-link>&nbsp;
          <b-link v-on:click="remove(article['.key'])">delete</b-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {db} from "../../firebase";

const articlesRef = db.ref('articles');

export default {
  name: 'articlesList',
  // firebase: {
  //   articles: articlesRef.limitToLast(25)
  // },
  computed: {
    reverseArticles() {
      return this.articles.slice().reverse();
    }
  },
  created() {
    this.$bindAsArray('articles', articlesRef.limitToLast(25))
  },
  methods: {
    remove: (id) => {
      console.log('remove', id);
      articlesRef.child(id).remove();
    }
  }
}
</script>
