<template>
  <div>
  <h3>find a restaurant</h3>
    <v-form @submit.prevent ref="searchBox">
      <v-text-field
          outlined 
          label="find a restaurant" 
          v-model="searchTerm.term"
          append-icon="mdi-magnify"
          @click:append="searchForBusiness"
          @keydown.enter="searchForBusiness">
      </v-text-field>
      <v-text-field
          :loading="isLoading"
          v-model="searchTerm.location"
          class="locationBox centered" 
          underlined 
          label="your location" 
          max-width="20"
          append-icon="mdi-map-marker-radius"
          @keydown.enter="searchForBusiness"
          @click:append="findMyLocation">
      </v-text-field>
    </v-form>

  </div>
        
</template>

<script>
import axios from 'axios'
  export default {
    name: 'SearchBox',
    data: () => ({
      searchTerm: {
        term: null, 
        location: null
        },
        isLoading: true
    }),
    mounted: function() {
      this.findMyLocation();
    },
    methods: {
      searchForBusiness: function (e){
        var vm = this;
        e.preventDefault();
        axios.post('http://localhost:3000/api/search', this.searchTerm)
        .then((res) => {
          var condensedRestaurantInfo = [];
          res.data.forEach((result)=> {
            condensedRestaurantInfo.push({
              id: result.id,
              name: result.name, 
              image: result.image_url, 
              url: result.url,
              location: result.location.display_address[0], 
              rating: result.rating, 
              reviews: result.review_count,
              distance: result.distance
            })
          })
          vm.$emit('send-search-results', condensedRestaurantInfo) 
        })
        .catch((err) => {
          console.log(err)
        })
      },
      findMyLocation: function(){
        // e.preventDefault();
        var vm = this;
        vm.isLoading = true;
        var options = {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(function(position){
          var coords = {
            lat: position.coords.latitude, 
            long: position.coords.longitude,
            mapQkey: 'IAgZTUY6CHjddilw58OA0RkulD9TIhNF'
          }
          axios.post(`http://www.mapquestapi.com/geocoding/v1/reverse?key=${coords.mapQkey}&location=${coords.lat},${coords.long}`)
          .then((res) =>{
            var foundLocation = {
              address: res.data.results[0].locations[0].street,
              cityState: `${res.data.results[0].locations[0].adminArea5}, ${res.data.results[0].locations[0].adminArea3}`,
            }
            vm.$set(vm.searchTerm, 'location', foundLocation.cityState);
            vm.isLoading = false;
          })
          .catch((err) =>{
            // if err in mapquest
            console.log(err)
          })
        }, function(){
          //if location not allowed or wifi issue
          vm.isLoading = false;
          // alert('allowing location is recommended for best performance')
        },options);
      }
    }
  }
</script>



<style scoped>
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
