<script>
import Map from './views/Map';

export default {
  name: "App",

  data: () => ({
    drawer: false,
    show: false
  }),
  computed: {
    user() {
      return this.$store.getters.userInfo;
    },
    currentModule() {
      return this.$route;
    }
  },
  mounted() {
    this.$firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("setUserInfo", {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
      } else {
        this.$router.push({ name: "Login" });
      }
    });
  },
  methods: {
    logout() {
      this.$firebase
        .auth()
        .signOut()
        .then(function() {
          this.$router.push({ name: "Login" });
        })
        .catch(() => {
          this.$router.push({ name: "Login" });
        });
    }
  }
};
</script>

<template>
  <v-app>
    <v-app-bar
      height="60"
      v-if="$route.name !== 'Login'"
      fixed
      color="#741EEC"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ currentModule.name }}</v-toolbar-title>
    </v-app-bar>
    <!--      Отрисовка данных о пользователе в меню -->
    <v-navigation-drawer v-model="drawer" absolute temporary app>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="user.photoURL"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">{{
              user.displayName
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item @click="$router.push({ name: 'Home' })">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Домой</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!--<v-list-group v-model="show" prepend-icon="mdi-file-chart">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Отчеты</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item @click="$router.push('/reports/7')">
            <v-list-item-icon>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>7 дней</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$router.push('/reports/30')">
            <v-list-item-icon>
              <v-icon>mdi-calendar-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>30 дней</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>-->

        <v-list-item @click="$router.push({ name: 'Map' })">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Карты</v-list-item-title>
          </v-list-item-content>
        </v-list-item>



        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div class="fill-height">
      <v-content class="page-content">
        <router-view></router-view>
      </v-content>
    </div>
  </v-app>
</template>

<style scoped>
.page-content {
  margin-top: 70px;
}
</style>
