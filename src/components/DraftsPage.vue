<template>
  <ApolloQuery :query="query">
    <template slot-scope="{ result: { loading, error, data } }">
      <div class="fl w-100 pl4 pr4">
        <div v-if="loading" class="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading ...</div>
        </div>
        <div v-else-if="error" class="flex w-100 h-100 items-center justify-center pt7">
          <div>An unexpected error occured.</div>
        </div>
        <section v-if="data">
            <h1>Feed</h1>
            <Post
              v-for="post in data.drafts"
              :key="post.id"
              :post="post"
              :isDraft="!post.isPublished"
            />
        </section>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
import Post from './Post'
import { DRAFTS_QUERY } from '../constants/graphql'
export default {
  name: 'Drafts',
  data () {
    return {
      query: DRAFTS_QUERY
    }
  },
  components: {
    Post
  }
}
</script>

<style scoped>

</style>