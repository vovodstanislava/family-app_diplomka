<script>
import { generateUuid } from "@/helpers/uuid";
export default {
  name: "Home",
  data() {
    return {
      item: 0,
      generateUuid,
      items: [],
      drawer: false,
      dialog: false,
      show: false,
      disableSave: false,
      rules: {
        text: [v => !!v || "Name is required"],
        price: [v => !!v || "Price is required"],
        image: [
          v =>
            !v || v.size < 12000000 || "Avatar size should be less than 12 MB!"
        ]
      },
      text: "",
      price: "",
      image: null,
      valid: true
    };
  },
  computed: {
    user() {
      return this.$store.getters.userInfo;
    }
  },
  mounted() {
    this.$firebase
      .firestore()
      .collection("goods")
      .orderBy("date", "desc")
      .onSnapshot(querySnapshot => {
        this.items = [];
        querySnapshot.forEach(doc => {
          this.items.push(doc.data());
        });
      });
  },
  methods: {
    getFormattedDate({ seconds }) {
      const today = new Date(seconds * 1000);
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      return `${dd}.${mm}.${yyyy}`;
    },
    async save() {
      if (this.$refs.form.validate()) {
        let image = "";

        this.disableSave = true;
        if (this.image) {
          const snapshot = await this.$firebase
            .storage()
            .ref()
            .child(`images/${this.generateUuid()}`)
            .put(this.image);

          image = await snapshot.ref.getDownloadURL();
        }

        try {
          await this.$firebase
            .firestore()
            .collection("goods")
            .add({
              text: this.text,
              price: this.price,
              date: new Date(),
              ...this.user,
              image
            });

          this.dialog = false;
          this.$refs.form.resetValidation();
          this.disableSave = false;
          this.text = "";
          this.price = "";
          this.image = null;
        } catch {
          this.disableSave = false;
        }
      }
    }
  }
};
</script>

<template>
  <div>
    <v-card class="mx-auto" :key="index" v-for="(item, index) of items">
      <v-list-item>
        <v-list-item-avatar color="grey">
          <v-img v-if="item.photoURL" :src="item.photoURL"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{
            item.displayName
          }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-img v-if="item.image" :src="item.image"></v-img>

      <v-card-text>
        {{ item.text }}
      </v-card-text>

      <v-card-actions>
        <v-btn text color="deep-purple accent-4"> {{ item.price }} $ </v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="deep-purple accent-4">
          {{ getFormattedDate(item.date) }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="90%">
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">Add product</span>
        </v-card-title>
        <v-card-text class="px-2">
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="text"
                    :rules="rules.text"
                    prepend-icon="mdi-card-text"
                    label="Text"
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="price"
                    :rules="rules.price"
                    label="Price"
                    type="number"
                    prepend-icon="mdi-currency-usd"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="image"
                    :rules="rules.image"
                    prepend-icon="mdi-camera"
                    accept="image/png, image/jpeg, image/bmp"
                    label="Upload image"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            :disabled="disableSave"
            text
            @click="dialog = false"
            >Close</v-btn
          >
          <v-btn
            color="blue darken-1"
            :disabled="disableSave"
            text
            @click="save"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-fab-transition>
      <v-btn
        @click="dialog = true"
        color="primary"
        fab
        large
        dark
        bottom
        right
        class="fab-button"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<style scoped>
.fab-button {
  position: fixed;
  bottom: 15px;
  right: 15px;
}
</style>
