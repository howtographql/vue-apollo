<template>
  <div>
    <div class="flex flex-column mt3">
      <input
        class="mb2"
        v-model="description"
        type="text"
        placeholder="A description for the link">
      <input
        class="mb2"
        v-model="url"
        type="text"
        placeholder="The URL for the link">
    </div>
    <button @click="createLink()">Submit</button>
  </div>
</template>

<script>
  import { ALL_LINKS_QUERY, CREATE_LINK_MUTATION } from '../constants/graphql'

  export default {
    name: 'CreateLink',
    data () {
      return {
        description: '',
        url: ''
      }
    },
    methods: {
      createLink () {
        const newDescription = this.description
        const newUrl = this.url
        this.description = ''
        this.url = ''

        this.$apollo.mutate({
          mutation: CREATE_LINK_MUTATION,
          variables: {
            description: newDescription,
            url: newUrl
          },
          update: (store, { data: { post } }) => {
            const data = store.readQuery({
              query: ALL_LINKS_QUERY,
              variables: {
                first: 5,
                skip: 0,
                orderBy: 'createdAt_DESC'
              }
            })
            data.feed.links.splice(0, 0, post)
            store.writeQuery({
              query: ALL_LINKS_QUERY,
              variables: {
                first: 5,
                skip: 0,
                orderBy: 'createdAt_DESC'
              },
              data
            })
          }
        }).then((data) => {
          this.$router.push({path: '/'})
        }).catch((error) => {
          console.error(error)
          this.newDescription = newDescription
          this.newUrl = newUrl
        })
      }
    }
  }
</script>
