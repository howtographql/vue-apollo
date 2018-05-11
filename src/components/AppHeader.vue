<template>
  <nav class="pa3 pa4-ns">
    <router-link
      class="link dim black b f6 f5-ns dib mr3"
      to="/"
      title="Feed"
    >
      Blog
    </router-link>
    <router-link
      class="link dim f6 f5-ns dib mr3 black"
      activeClassName="gray"
      to="/"
      title="Feed"
    >
      Feed
    </router-link>
    <router-link
      class="link dim f6 f5-ns dib mr3 black"
      activeClassName="gray"
      to="/drafts"
      title="Drafts"
    >
      Drafts
    </router-link>
    <router-link
      to="/create"
      class="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
    >
      + Create Draft
    </router-link>
  </nav>
</template>

<script>
  import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants/settings'

  export default {
    name: 'AppHeader',
    computed: {
      userId () {
        return this.$root.$data.userId
      }
    },
    methods: {
      logout () {
        localStorage.removeItem(GC_USER_ID)
        localStorage.removeItem(GC_AUTH_TOKEN)
        this.$root.$data.userId = localStorage.getItem(GC_USER_ID)
      }
    }
  }
</script>
