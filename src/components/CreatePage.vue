<template>
  <div class="pa4 flex justify-center bg-white">
    <form @submit.prevent="onSubmit">
      <h1>Create Draft</h1>
      <input
        autoFocus
        class="w-100 pa2 mv2 br2 b--black-20 bw1"
        placeholder="Title"
        type="text"
        v-model="title"
      />
      <textarea
        class="db w-100 ba bw1 b--black-20 pa2 br2 mb2"
        cols="50"
        placeholder="Content"
        rows="8"
        v-model="text"
      />
      <input
        :class="`pa3 bg-black-10 bn ${text && title && 'dim pointer'}`"
        :disabled="!text || !title"
        type="submit"
        value="Create"
      />
      <a class="f6 pointer" @click="goBack" >
        or cancel
      </a>
    </form>
    <div v-if="error" class="flex w-100 h-100 items-center justify-center pt7">
      <div>An unexpected error occured.</div>
    </div>
  </div>
</template>

<script>
import { CREATE_DRAFT_MUTATION, DRAFTS_QUERY } from '../constants/graphql'
export default {
  name: 'Create',
  data () {
    return {
      title: '',
      text: '',
      error: false
    }
  },
  methods: {
    onSubmit () {
      const {title, text} = this
      this.$apollo.mutate({
        mutation: CREATE_DRAFT_MUTATION,
        variables: {
          title, text
        },
        update: (cache, { data: { createDraft } }) => {
          const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
          cache.writeQuery({
            query: DRAFTS_QUERY,
            data: { drafts: drafts.concat([createDraft]) }
          })
        }
      })
      .then((data) => {
        this.$router.replace('/drafts')
      })
      .catch(() => { this.error = true })
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
