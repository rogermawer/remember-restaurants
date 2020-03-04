<template>
  <div>
      <v-container>
        <v-row>
          <v-col cols="6" sm="3">
              <v-select
                label="filter by"
                v-model="selectedFilter"
                v-bind:items="filters"
                @input="filterBy(selectedFilter)"
                >
              </v-select>
          </v-col>
        </v-row>
          <v-row align="center" justify="center">
            <v-col cols="12" md="4" sm="6" v-for="result in transitSearchResults" v-bind:key="result.id">

              <v-card>
                <v-card-title><a target="_blank" v-bind:href="result.url">{{result.name}}</a></v-card-title>
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
                <v-card-text class="pt-0">{{result.reviews}} reviews</v-card-text>
                <v-img v-bind:src="result.image" aspect-ratio="1"></v-img>
                <v-card-actions>
                  <v-btn icon @click="saveRestaurant(result.id)">
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                  <v-btn icon>
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
  export default {
    name: 'SearchResults',
    props:['transitSearchResults', 'mySavedRestaurants'],
    data: () => ({
      savedAlert: {
        shown: false,
        msg: null
      },
      filters:['distance', 'rating'],
      selectedFilter: null,
    }),
    methods: {
      saveRestaurant: function(restaurantId) {
        var savedRestaurant = this.transitSearchResults.filter(restaurant => {
          return restaurantId == restaurant.id
        })
        //check if saved restaurant is already saved
        if (!this.mySavedRestaurants.filter((res) => {return res.id == savedRestaurant[0].id}).length > 0) {
          this.$emit('saved-restaurant', savedRestaurant[0])
          this.savedAlert = {shown: true, msg: 'saved!'};
        }else{
          this.savedAlert = {shown: true, msg: 'this place is already saved!'};
        }
      },
      filterByDistance (values){
        this.transitSearchResults = values.sort((a, b) => {return a.distance - b.distance})
      },
      filterByRating (values){
        this.transitSearchResults = values.sort((a, b) => {return b.rating - a.rating})
      },
      filterBy (filter) {
        if (filter === 'distance') {
          this.filterByDistance(this.transitSearchResults)
        }
        if (filter === 'rating') {
          this.filterByRating(this.transitSearchResults)
        }
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
