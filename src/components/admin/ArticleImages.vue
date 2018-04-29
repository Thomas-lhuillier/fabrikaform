<template>
  <b-card bg-variant="primary" text-variant="white" header="Images">
    <dl>
      <dd class="small">no image added on this article yet</dd>
    </dl>
    <b-button v-b-modal.imagesModal size="sm" variant="outline-light">Add image</b-button>

    <!-- Modal -->
    <b-modal id="imagesModal" hide-footer size="lg" title="Images" body-bg-variant="light" body-text-variant="dark">
      <b-card no-body>
        <b-tabs card small v-model="tabIndex">

          <!-- upload TAB -->
          <b-tab title="Upload files" active>
            <b-form class="uploadArea my-3" enctype="multipart/form-data">
              <input type="file" multiple accept="image/*" style="display: none;"
                      ref="uploadInput"
                      @change="handleFileInputChange($event)">
              <b-button variant="primary"
                        v-on:click="$refs.uploadInput.click()">
                Select files
              </b-button>
              <span class="small ml-2">or drop files here</span>
            </b-form>
          </b-tab>

          <!-- library TAB -->
          <b-tab title="Images library">
            <dl class="card-columns my-2">
              <template v-if="uploadingImages.length || images.length">
                <!-- uploading files -->
                <UploadingImage v-for="(file, index) in uploadingImages"
                                :key="file['name']"
                                v-bind:originalFile="file"
                                v-bind:index="index"
                ></UploadingImage>

                <!-- files library -->
                <dd v-for="image in images" :key="image['.key']" class="card">
                  <template v-if="isset(() => image.thumbs['256'].publicUrl)">
                    <img v-bind:src="image.thumbs['256'].publicUrl" alt="" class="card-img-top">
                  </template>
                  <template v-else-if="isset(() => image.publicUrl)">
                    <img v-bind:src="image.publicUrl" alt="" class="card-img-top">
                  </template>

                  <div v-if="isset(() => image.name)" class="card-body">
                    {{image.name}}
                  </div>

                  <div class="card-footer p-1 pl-2 clearfix">
                    <span class="small text-muted">{{image.sizeHuman}}</span>
                    <b-button v-on:click="removeImage(image)" class="btn-action btn-remove float-right"><icon name="regular/trash-alt"></icon></b-button>
                  </div>
                </dd>
              </template>

              <!-- Empty state -->
              <p v-else class="small">No image added to your gallery yet. Upload some images first.</p>
            </dl>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-modal>
  </b-card>
</template>

<script>
import UploadingImage from '@/components/admin/UploadingImage.vue';
import { db, storage } from '../../firebase';
const storageRef = storage.ref();

export default {
  name: 'articleImages',
  components: {
    UploadingImage
  },
  props: {
    articleId: {
      required: false
    }
  },
  firebase: {
    articles: db.ref('articles'),
    images: db.ref('images')
  },
  data: function() {
    return {
      tabIndex: 0
    };
  },
  computed: {
    uploadingImages: function() {
      return this.$store.getters.UploadingFiles;
    }
  },
  methods: {
    handleFileInputChange($event) {
      let files = $event.target.files;
      let storageRef = storage.ref();
      let imagesRef = this.$firebaseRefs.images;

      Object.keys(files).forEach(index => {
        let file = files[index];
        this.$store.commit('ADD_UPLOADING_FILE', { originalFile: file });
      });

      // Switch tab
      this.tabIndex = 1;
    },
    removeImage(image) {
      // Delete file from storage
      if (image.path) {
      storageRef
        .child(image.path)
        .delete()
        .then(() => {
          console.log('File deleted');
        })
        .catch(err => {
          console.log(err.message);
        }).then(() => {
          // Always remove the entry
          this.$firebaseRefs.images.child(image['.key']).remove();
        });
      } else {
        this.$firebaseRefs.images.child(image['.key']).remove();
      }
    },
    isset(fn) {
      let value;
      try {
        value = fn();
      } catch (e) {
        value = undefined;
      } finally {
        return value !== undefined;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~bootstrap/scss/_functions.scss';
@import '~bootstrap/scss/_variables.scss';

.uploadArea {
  padding: 4rem;
  text-align: center;
  background-color: $gray-200;
  border-radius: $border-radius-lg;
  border-style: dashed;
  border-width: 3px;
  border-color: $gray-500;
}

.card > img {
  max-width: 100%;
}
</style>