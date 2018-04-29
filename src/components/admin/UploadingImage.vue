<template>
  <dd class="card p-2 bg-primary text-light">
    <div class="small mb-2">{{ file.name }}</div>
    <b-progress :max="100"
                :value="file.progress"
                variant="warning"
                height="0.5rem"
                animated
                class="bg-white border"
    ></b-progress>
  </dd>
</template>

<script>
import { db, storage } from '../../firebase';

const articlesRef = db.ref('articles');
const storageRef = storage.ref();

export default {
  name: 'uploadingImage',
  props: {
    index: {
      required: true
    },
    originalFile: {
      required: true
    },
    articleID: {
      required: false,
      default: null
    }
  },
  watch: {},
  data: function() {
    return {
      file: {
        name: this.originalFile.name,
        size: this.originalFile.size,
        type: this.originalFile.type,
        bytesTransferred: 0,
        progress: 0,
        url: null,
        path: null
      },
    };
  },
  firebase: {
    images: db.ref('images')
  },
  methods: {
    upload() {
      let path = new Date().getTime() + '_' + this.originalFile.name;
      let fileRef = storageRef.child(path);

      let uploadTask = fileRef.put(this.originalFile);
      // Listen to firebase storage
      uploadTask.on(
        'state_changed',
        snapshot => {
          // Observe upload changes to set progress
          let progress = parseInt(
            snapshot.bytesTransferred / this.file.size * 100
          );
          this.$set(this.file, 'bytesTransferred', snapshot.bytesTransferred);
          this.$set(this.file, 'progress', progress);
        },
        err => {
          // Handle upload errors
          console.log(err);
        },
        () => {
          // Handle upload success
          fileRef.getMetadata().then(() => {
            let metadata = {
              customMetadata: {
                name: this.originalFile.name,
                path: path,
                url: uploadTask.snapshot.downloadURL
              }
            }
            fileRef.updateMetadata(metadata);
          });
          this.$store.commit('REMOVE_UPLOADING_FILE', this.index);
        }
      );
    }
  },
  created() {
    this.upload();
  }
};
</script>