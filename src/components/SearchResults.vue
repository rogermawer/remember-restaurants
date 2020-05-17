<template>
  <div>
      <v-container>
        <ResultFilter
          v-bind:whatToFilter="transitSearchResults"
        ></ResultFilter>
       
          <v-row align="center" justify="center">
            <v-col cols="12" md="4" sm="6" v-for="result in transitSearchResults" v-bind:key="result.id">

              <v-card>
                <v-card-title><a target="_blank" v-bind:href="result.url">{{result.bizname}}</a></v-card-title>
                <v-card-text class="pb-0">{{result.location}}</v-card-text>
                <v-rating
                  class="ml-1" 
                  v-bind:value="result.rating"
                  half-increments
                  background-color="amber"
                  color="amber"
                  size="20"
                  readonly
                  >
                </v-rating>
                <v-card-text class="pt-0">{{result.numreviews}} reviews</v-card-text>
                <v-img v-bind:src="result.image" aspect-ratio="1"></v-img>
                <v-card-actions>
                  <v-btn icon @click="saveRestaurant(result.bizid)">
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                  <v-btn icon @click="mapToRestaurant(result.location)">
                    <v-icon>mdi-map-marker</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
              
            </v-col>
          </v-row>
          <v-snackbar
            v-model="savedAlert.shown">
            {{savedAlert.msg}}
            <v-btn
              @click="savedAlert.shown = false"
              text
              color="red">close</v-btn>
          </v-snackbar>
      </v-container>
  </div>
        
</template>

<script>
import {EventBus} from '@/event-bus.js';
import ResultFilter from '@/components/ResultFilter.vue';

  export default {
    name: 'SearchResults',
    components: {
      ResultFilter
    },
    props:['transitSearchResults', 'mySavedRestaurants'],
    data: () => ({
      savedAlert: {
        shown: false,
        msg: null
      }
    }),
    methods: {
      saveRestaurant: function(restaurantId) {
        var savedRestaurant = this.transitSearchResults.filter(restaurant => {
          return restaurantId == restaurant.bizid
        })
        //check if saved restaurant is already saved
        if (!this.mySavedRestaurants.filter((res) => {return res.bizid == savedRestaurant[0].bizid}).length > 0) {
          EventBus.$emit('saved-restaurant', savedRestaurant[0])
          this.savedAlert = {shown: true, msg: 'saved!'};
        }else{
          this.savedAlert = {shown: true, msg: 'this place is already saved!'};
        }
      },
      mapToRestaurant: function(address) {
        window.open(`https://www.google.com/maps/place/${address}`, "_blank")
    }
    }
  }
</script>



<style scoped>
.v-card__text, .v-card__title {
  word-break: normal;
}
.v-application a {
  color:#000000;
  text-decoration: none
}
.locationBox{
  width:50%
}
.centered{
  text-align: center;
  margin:auto;
  justify-content: center;
  align-items: center
}
</style>
