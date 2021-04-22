import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueGeolocation from 'vue-browser-geolocation';


import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

Vue.use(VueGeolocation);


Vue.config.productionTip = false;

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDRvUosBjFk83EBzgZ4Rep4InedUHo7Kz8'
  }
})

firebase.initializeApp({
  apiKey: "AIzaSyD7J_BIoSlvE1Jzl-ccTqeGHnVVJ4U1iw4",
  authDomain: "family-60ba7.firebaseapp.com",
  databaseURL: "https://family-60ba7.firebaseio.com",
  projectId: "family-60ba7",
  storageBucket: "family-60ba7.appspot.com",
  messagingSenderId: "316319847348",
  appId: "1:316319847348:web:281c92a41cb4b8c4ff18e1"
});

// делаем firebase глобальным для доступа в к нему в компонентах
Vue.prototype.$firebase = firebase;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
