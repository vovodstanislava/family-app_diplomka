<script>
  import {auth} from "firebaseui";

  export default {
    name: "Home",
    data() {
      return {
        auth,
        ui: null,
        load: true
      };
    },
    mounted() {
      this.ui = new this.auth.AuthUI(this.$firebase.auth());
      this.ui.start("#firebaseui-auth-container", {
        callbacks: {
          signInSuccessWithAuthResult: authResult => {
            const { user } = authResult;
            this.$store.dispatch("setUserInfo", {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL
            });
            this.$router.push({ name: "Home" });
          }
        },
        signInOptions: [
          this.$firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          this.$firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      });
    }
  };
</script>

<template>
    <div class="fill-height">
        <v-card class="elevation-0">
            <v-container v-show="load" class="auth-container" fluid>
                <div id="firebaseui-auth-container"></div>
            </v-container>
        </v-card>
    </div>
</template>

<style scoped>
    .auth-container {
        height: calc(100vh - 50px);
    }
</style>
