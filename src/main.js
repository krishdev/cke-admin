// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import firebase from 'firebase'

import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(VueResource);
Vue.use(Vuetify);
//Vue.use(VueFire);

firebase.initializeApp({
  apiKey: "AIzaSyAWoUg2sgNZ_DzIY1aPdbv4U9FQx59oJ0c",
  authDomain: "chotukiedu.firebaseapp.com",
  databaseURL: "https://chotukiedu.firebaseio.com",
  projectId: "chotukiedu",
  storageBucket: "chotukiedu.appspot.com",
  messagingSenderId: "449693301627"
})

export const db = firebase.database()
export const fb = firebase.auth()
export const storageRef = firebase.storage().ref();
window.db = db;
window.fb = fb;
window.provider = new firebase.auth.GoogleAuthProvider();
window.storageRef = storageRef;
/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  created () {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        //console.log(firebaseUser);
      }
      //console.log(firebaseUser);
    })
  } 
})
