<template>
      <v-container>
        <h3 v-if="mySavedRestaurants.length < 1">You have no saved restuarants yet! <router-link to="/">Try finding one</router-link>.</h3>
          <v-row align="center" justify="center">
           
            <v-col cols="12" md="4" sm="6" v-for="result in mySavedRestaurants" v-bind:key="result.id">
              <v-card>

                <v-card-title>{{result.name}} </v-card-title>
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
                  <v-btn icon>
                    <v-icon>mdi-map-marker</v-icon>
                  </v-btn>
                  <v-btn @click="removeFromSaved(result.id)" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>

              </v-card>
            </v-col>
          </v-row>
      </v-container>
</template>

<script>
// @ is an alias to /src
// import SearchResults from '@/components/SearchResults.vue'

export default {
  name: 'Remembered',
  props:['transitSearchResults', 'mySavedRestaurants'],
  components: {
    
  },
  data: () => ({
    
  }),
  methods: {
    removeFromSaved: function(id) {
      var updatedMySavedRestaurantsArray = this.mySavedRestaurants.filter((item) => {return item.id != id})
      this.$emit('delete-restaurant', updatedMySavedRestaurantsArray, id)
      
    }
  }
}
</script>