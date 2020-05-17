<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center" >
      <v-col>
        
        <SearchBox 
          @send-search-results="searchResultsToParent">
        </SearchBox>

        <transition
          name="slide-right"
          mode="out-in">
          <SearchResults 
            v-if="transitSearchResults.length > 1"
            v-bind:transitSearchResults="transitSearchResults"
            v-bind:mySavedRestaurants="mySavedRestaurants">
          </SearchResults>
        </transition>

      </v-col>
    </v-row>
    
  </v-container>

</template>

<script>
// @ is an alias to /src
import SearchBox from '@/components/SearchBox.vue'
import SearchResults from '@/components/SearchResults.vue'

export default {
  name: 'Home',
  props:['transitSearchResults', 'mySavedRestaurants'],
  components: {
    SearchBox, SearchResults
  },
  data: () => ({
    
  }),
  methods: {
    searchResultsToParent (value) {
      //relay results up to parent. necessary in order to keep data when changing routes
      this.$emit('search-results-to-parent', value) 
    },
    savedRestaurantToParent (value) {
      //relay results up to parent. necessary in order to keep data when changing routes
      this.$emit('saved-restaurants-to-parent', value) 
    }
  }
}
</script>
<style scoped>

.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.3s;
  transition-property: all;
  transition-timing-function: ease;
}

.slide-right-enter,
.slide-right-leave-active {
  transform: translateX(-2000px)
}
.slide-right-leave {
  transform: translateX(0px)
}

</style>