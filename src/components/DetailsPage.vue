<template>
  <ApolloQuery :query="query" :variables="{id: $route.params.id}">
    <template slot-scope="{ result: { loading, error, data } }">
      <div class="fl w-100 pl4 pr4">
        <div v-if="loading" class="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading ...</div>
        </div>
        <div v-else-if="error" class="flex w-100 h-100 items-center justify-center pt7">
          <div>An unexpected error occured.</div>
        </div>
        <section v-if="data">
            <h1 class="f3 black-80 fw4 lh-solid">{{data.post.title}}</h1>
            <p class="black-80 fw3">{{data.post.text}}</p>
            <a v-if="!data.post.isPublished" class="f6 dim br1 ba ph3 pv2 mb2 dib black pointer" @click="onPublish(data.post.id)">
              Publish
            </a>
            <a class="f6 dim br1 ba ph3 pv2 mb2 dib black pointer" @click="onDelete(data.post.id, data.post.isPublished)">
              Delete
            </a>
        </section>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
import { POST_QUERY, PUBLISH_MUTATION, DRAFTS_QUERY, FEED_QUERY, DELETE_MUTATION } from '../constants/graphql'
export default {
  name: 'Drafts',
  data () {
    return {
      query: POST_QUERY
    }
  },
  methods: {
    onPublish (id) {
      this.$apollo.mutate({
        mutation: PUBLISH_MUTATION,
        variables: { id },
        update: (cache, { data }) => {
          const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
          const { feed } = cache.readQuery({ query: FEED_QUERY })
          cache.writeQuery({
            query: FEED_QUERY,
            data: { feed: feed.concat([data.publish]) }
          })
          cache.writeQuery({
            query: DRAFTS_QUERY,
            data: {
              drafts: drafts.filter(draft => draft.id !== data.publish.id)
            }
          })
        }
      })
      .then((data) => {
        this.$router.replace('/')
      })
    },
    onDelete (id, isPublished) {
      this.$apollo.mutate({
        mutation: DELETE_MUTATION,
        variables: { id },
        update: (cache, { data }) => {
          if (isPublished) {
            const { feed } = cache.readQuery({ query: FEED_QUERY })
            cache.writeQuery({
              query: FEED_QUERY,
              data: {
                feed: feed.filter(post => post.id !== data.deletePost.id)
              }
            })
          } else {
            const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
            cache.writeQuery({
              query: DRAFTS_QUERY,
              data: {
                drafts: drafts.filter(draft => draft.id !== data.deletePost.id)
              }
            })
          }
        }
      })
      .then((data) => {
        this.$router.replace('/')
      })
    }
  }
}
</script>

<style scoped>

</style>