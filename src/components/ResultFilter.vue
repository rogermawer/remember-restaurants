<template>
  <div>
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
  </div>
</template>

<script>
// import {EventBus} from '@/event-bus.js'

export default {
  name: "ResultFilter",
  props: ["whatToFilter"],
  data: () => ({
    filters: ["distance", "rating"],
    selectedFilter: null,
  }),
  methods: {
    filterByDistance(values) {
      this.whatToFilter = values.sort((a, b) => {
        return a.distance - b.distance;
      });
    },
    filterByRating(values) {
      this.whatToFilter = values.sort((a, b) => {
        return b.rating - a.rating;
      });
    },
    filterBy(filter) {
      if (filter === "distance") {
        this.filterByDistance(this.whatToFilter);
      }
      if (filter === "rating") {
        this.filterByRating(this.whatToFilter);
      }
    },
  },
};
</script>

<style scoped>
.v-card__text,
.v-card__title {
  word-break: normal;
}
.v-application a {
  color: #000000;
  text-decoration: none;
}
.locationBox {
  width: 50%;
}
.centered {
  text-align: center;
  margin: auto;
  justify-content: center;
  align-items: center;
}
</style>
