<script>
export default {
  name: "Reports",
  data() {
    return {
      items: {}
    };
  },
  computed: {
    formattedItems() {
      const items = {};

      for (const key in this.items) {
        const [user] = this.items[key];
        items[key] = {
          displayName: user.displayName,
          date: user.date.seconds * 1000,
          email: user.email,
          graphic: [...new Array(+this.$route.params.days)].map(() => 0),
          photoURL: user.photoURL,
          total: this.items[key]
            .map(item => +item.price)
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ),
          avg: (
            this.items[key]
              .map(item => +item.price)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              ) / this.items[key].length
          ).toFixed(2)
        };

        for (const el of this.items[key]) {
          const day = this.getDay(new Date(), new Date(el.date.seconds * 1000));

          items[key].graphic[day] += +user.price;
        }
        items[key].graphic = items[key].graphic.reverse();
      }
      return items;
    }
  },
  mounted() {
    this.$firebase
      .firestore()
      .collection("goods") // из базы данных goods
      .orderBy("date", "desc")
      .onSnapshot(querySnapshot => {
        this.items = {};
        querySnapshot.forEach(doc => {
          const document = doc.data();
          if (!this.items[document.email]) {
            this.items[document.email] = [];
          }

          if (
            this.getDay(new Date(), new Date(document.date.seconds * 1000)) <
            +this.$route.params.days
          ) {
            this.items[document.email].push(doc.data());
          }
        });
      });
  },
  methods: {
    getDay(date, date1) {
      return Math.ceil(
        Math.abs(date.getTime() - date1.getTime()) / (1000 * 3600 * 24)
      );
    }
  }
};
</script>

<template>
  <div>
    <v-expansion-panels inset>
      <v-expansion-panel
        class="mx-auto"
        :key="index"
        v-for="(user, index) of formattedItems"
      >
        <v-expansion-panel-header>
          <v-list-item>
            <v-list-item-avatar color="grey">
              <v-img v-if="user.photoURL" :src="user.photoURL"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline">{{
                user.displayName
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="panel-content">
          <v-sheet color="primary">
            <v-sparkline
              :value="user.graphic"
              color="white"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">
                {{ item.index + 1 }}
              </template>
            </v-sparkline>
          </v-sheet>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                AVG
              </v-list-item-title>
              <v-list-item-action class="action-width">
                {{ user.avg }} $
              </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-title>
                Total
              </v-list-item-title>
              <v-list-item-action class="action-width">
                <div>{{ user.total }} $</div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style scoped>
.panel-content >>> .v-expansion-panel-content__wrap {
  padding: 4px !important;
}
.action-width {
  text-align: right !important;
  width: 100px;
}

.action-width>>div {
  margin-left: auto;
}
</style>
