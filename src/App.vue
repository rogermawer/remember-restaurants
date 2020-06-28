<template>
  <v-app>
    <v-app-bar class="background-color" app dark>
      <div>
        <h3 class="mb-0">remember restaurants - Hi {{ loggedInUser.name }}!</h3>
      </div>

      <v-spacer></v-spacer>

      <router-link class="nav-link" to="/">home</router-link>
      <router-link class="nav-link" to="/remembered">remembered</router-link>
    </v-app-bar>

    <v-content>
      <transition name="fade" mode="out-in">
        <router-view
          v-bind:transitSearchResults="savedResults"
          v-bind:mySavedRestaurants="mySavedRestaurants"
        />
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
import { EventBus } from "@/event-bus.js";

export default {
  name: "App",
  components: {},

  data: () => ({
    savedResults: [],
    mySavedRestaurants: [],
    loggedInUser: {
      id: null,
      name: null,
    },
  }),
  mounted: function() {
    this.getUserData(),
      this.getSavedRestaurants(),
      EventBus.$on("send-search-results", this.saveSearchResults),
      EventBus.$on("saved-restaurant", this.saveRestaurant),
      EventBus.$on("delete-restaurant", this.deleteRestaurant);
  },
  methods: {
    getUserData() {
      axios
        .get("/api/userdata")
        .then((res) => {
          this.loggedInUser = { id: res.data.id, name: res.data.username };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSavedRestaurants() {
      axios
        .get("/api/saveddata")
        .then((res) => {
          this.mySavedRestaurants = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveSearchResults(value) {
      this.savedResults = [];
      this.savedResults = value;
    },
    saveRestaurant(value) {
      axios
        .post("/api/save", value)
        .then((res) => {
          value.id = res.data.id;
          this.mySavedRestaurants.push(value);
        })
        .catch((err) => {
          //error saving to DB
          console.log(err);
        });
    },
    deleteRestaurant(id) {
      var updatedArray = this.mySavedRestaurants.filter((item) => {
        return item.id != id;
      });
      this.mySavedRestaurants = updatedArray;
      axios
        .post("/api/delete", { id: id })
        .then((res) => {
          //success
          console.log(res);
        })
        .catch((err) => {
          //error saving to DB
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.background-color {
  background-color: #3a3a3a !important;
}
.nav-link {
  color: white;
  padding: 0 10px 0 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
