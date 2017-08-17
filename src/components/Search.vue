<template>
  <div>
    <div>
      Search
      <input type="text" v-model="searchText">
      <button @click="executeSearch()">OK</button>
    </div>
    <link-item
      v-for="(link, index) in allLinks"
      :key="link.id"
      :link="link"
      :index="index">
    </link-item>
  </div>
</template>

<script>
  import { ALL_LINKS_SEARCH_QUERY } from '../constants/graphql'
  import LinkItem from './LinkItem'

  export default {
    name: 'Search',
    data () {
      return {
        allLinks: [],
        searchText: ''
      }
    },
    methods: {
      executeSearch () {
        const { searchText } = this
        this.$apollo.query({
          query: ALL_LINKS_SEARCH_QUERY,
          variables: { searchText }
        }).then((result) => {
          const links = result.data.allLinks
          this.allLinks = links
        })
      }
    },
    components: {
      LinkItem
    }
  }
</script>

<style scoped>

</style>
