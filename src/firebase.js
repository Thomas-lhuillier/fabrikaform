import Firebase from 'firebase';
import configuration from 'firebaseConfig';

export const firebase = Firebase.initializeApp(configuration);
export const db = firebase.database();
export const storage = firebase.storage();
