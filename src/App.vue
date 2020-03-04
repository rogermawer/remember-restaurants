<template>
  <v-app>
    <v-app-bar class="background-color"
      app
      dark
    >
      <div>
        <h3 class="mb-0">remember restaurants</h3>
      </div>

      <v-spacer></v-spacer>

    <router-link class="nav-link" to="/">home</router-link>
    <router-link class="nav-link" to="/remembered">remembered</router-link>

    </v-app-bar>
    
    <v-content>

    <transition
      name="fade"
      mode="out-in">
      <router-view 
        @search-results-to-parent="saveSearchResults" 
        v-bind:transitSearchResults="savedResults"
        @saved-restaurants-to-parent="saveRestaurant"
        v-bind:mySavedRestaurants="mySavedRestaurants"
        @delete-restaurant="deleteRestaurant"/>
    </transition>

    </v-content>

  </v-app>
</template>

<script>


export default {
  name: 'App',
  components: {
  
  },

  data: () => ({
    savedResults: [],
    mySavedRestaurants: []
  }),
  mounted: function(){
    this.getSavedRestaurants()
  },
  methods: {
    getSavedRestaurants () {
      console.log('getting saved restaurants form DB, emit to parent')
    },
    saveSearchResults (value){
      this.savedResults = [];
      this.savedResults = value;
    },
    saveRestaurant (value) {
      this.mySavedRestaurants.push(value);
      this.updateDataBase(value);
    },
    deleteRestaurant (updatedArray, id) {
      this.mySavedRestaurants = updatedArray;
      this.updateDataBase(id);
    },
    updateDataBase (savedRestaurant) {
      console.log('update DB with newly saved restaurant', savedRestaurant)
    }
  }
};
</script>

<style scoped>
.background-color{background-color: #3A3A3A!important}
.nav-link{
  color:white;
  padding:0 10px 0 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}


</style>
