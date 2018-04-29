/* eslint-env node */
/* eslint-disable no-console */
// prettier-ignore

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const gcs = require('@google-cloud/storage')({
  projectId: 'vuejs-router-test',
  keyFilename: './keyfile.json'
});
const sharp = require('sharp');
const path = require('path');
const os = require('os');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://vuejs-router-test.firebaseio.com'
});

const thumb_sizes = [64, 256, 512]; // Resize target width in pixels

exports.generateThumbnails = functions.storage.object().onFinalize(object => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
  // const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

  if (
    resourceState == 'not_exists' ||
    !contentType.startsWith('image/') ||
    filePath.startsWith('thumbs/')
  ) {
    console.log('abort');
    return;
  }

  const fileName = filePath.split('/').pop();
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  let charsToRemove = object.name.split('_')[0].length + 1;
  let name = object.name.slice(charsToRemove);
  let image = {
    contentType: object.contentType,
    size: object.size,
    sizeHuman: humanFileSize(object.size),
    name: name,
    path: object.name,
    timeCreated: object.timeCreated,
    updated: object.timeCreated,
    width: null,
    height: null,
    publicUrl: null,
    thumbs: {},
    status: 'creating'
  };

  /**
   * Get signed URL and update image entry
   * @return promise
   */
  function setSignedUrl(imagesRef, imageRef, key) {
    console.log('setSignedUrl called', key);
    const filePath = object.name;

    return new Promise((resolve, reject) => {
      bucket
        .file(filePath)
        .getSignedUrl({ action: 'read', expires: '03-09-2491' })
        .then(signedUrls => {
          imagesRef
            .child(key)
            .update({ publicUrl: signedUrls[0] })
            .then(() => {
              resolve();
            })
            .catch(err => {
              console.log('error setting signedUrl:', err);
              reject(err);
            });
        });
    });
  }

  /**
   * Download file in temp folder before be
   * @return promise
   */
  function downloadTempFile() {
    console.log('downloadTempFile', filePath, tempFilePath);

    return new Promise((resolve, reject) => {
      bucket
        .file(filePath)
        .download({ destination: tempFilePath })
        .then(data => {
          console.log('Download successful:', filePath, tempFilePath, data[0]);
          resolve();
        })
        .catch(err => {
          reject(err);
          throw new Error('Error while downloading temp file:', err);
        });
    });
  }

  /**
   * Get image dimensions and update image entry
   * @return promise
   */
  function setSizeInfo(imagesRef, imageRef, key) {
    console.log('setSizeInfo called', key, tempFilePath);

    return new Promise((resolve, reject) => {
      sharp(tempFilePath)
        .metadata()
        .then(info => {
          imagesRef
            .child(key)
            .update({ width: info.width, height: info.height })
            .then(() => {
              resolve();
            })
            .catch(err => {
              console.log('error while updating image entry:', err);
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
          throw new Error('error while getting image metadata:', err);
        });
    });
  }

  /**
   * Create thumbs and update image entry
   * @return promise
   */
  function makeThumbs(imagesRef, imageRef, key) {
    console.log('makeThumbs called', filePath, tempFilePath);

    return new Promise((resolve, reject) => {
      downloadTempFile()
        .then(() => {
          setSizeInfo(imagesRef, imageRef, key);
        })
        .catch(err => {
          reject(err);
        })
        .then(() => {
          let thumb_promises = [];
          thumb_sizes.forEach(size => {
            let thumb_promise = new Promise((resolve, reject) => {
              console.log('thumb_' + size + '_' + fileName);

              // sharp(tempFilePath)
              //   .resize(size, null)
              //   .toFile(newFileTemp, () => {
              //     bucket
              //       .upload(newFileTemp, {
              //         public: true,
              //         destination: newFilePath
              //       })
              //       .then(() => {
              //         bucket
              //           .file(newFilePath)
              //           .getSignedUrl({
              //             action: 'read',
              //             expires: '03-09-2491'
              //           })
              //           .then(signedUrls => {
              //             console.log(`signed URL for size ${size}:`, signedUrls);
              //           }).then(() => {
              //             resolve();
              //           });
              //       });
              //   });

              resolve();
            });

            thumb_promises.push(thumb_promise);
          });

          Promise.all(thumb_promises)
            .then(() => {
              fs.unlinkSync(tempFilePath);
              resolve();
            })
            .catch(err => {
              console.log('error while making thumb:', err);
              reject();
            });
        });
    });
  }

  /**
   * Add new image entry to database containing file info.
   * @return promise
   */
  function addImageRef() {
    console.log('addImageRef called');

    return new Promise((resolve, reject) => {
      const imagesRef = admin.database().ref('/images');
      const imageRef = imagesRef
        .push(image)
        .then(snap => {
          console.log('added image entry', snap.key);
          resolve({
            imagesRef: imagesRef,
            imageRef: imageRef,
            key: snap.key
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  return new Promise((resolve, reject) => {
    // Add image entry to database
    addImageRef()
      .then(result => {
        Promise.all([
          makeThumbs(result.imagesRef, result.imageRef, result.key),
          setSignedUrl(result.imagesRef, result.imageRef, result.key)
        ]).then(() => {
          resolve();
        });
      })
      .catch(err => {
        reject(err);
      });
  });
});

// exports.deleteThumbnails = functions.storage.object().onDelete(object => {
//   const fileBucket = object.bucket; // The Storage bucket that contains the file.
//   const bucket = gcs.bucket(fileBucket);
//   const filePath = object.name; // File path in the bucket.
//   const contentType = object.contentType; // File content type.

//   if (!contentType.startsWith('image/') || filePath.startsWith('thumbs/')) {
//     return;
//   }

//   return _.each(thumb_sizes, size => {
//     let thumbFileName = `thumb_${size}_${object.name}`;
//     let thumbFilePath = `thumbs/${thumbFileName}`;

//     bucket
//       .file(thumbFilePath)
//       .delete()
//       .then(function() {
//         // File deleted successfully
//         console.log('image deleted:', thumbFilePath);
//       })
//       .catch(function(error) {
//         // Uh-oh, an error occurred!
//         console.log(error);
//       });
//   });
// });

const humanFileSize = function(size) {
  let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
};
