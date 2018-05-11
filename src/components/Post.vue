<template>
  <router-link class="no-underline ma1" :to="`/post/${post.id}`">
    <h2 v-if="isDraft" class="f3 black-80 fw4 lh-solid">{{post.title}} (Draft)</h2>
    <h2 v-else class="f3 black-80 fw4 lh-solid">{{post.title}}</h2>
    <p class="black-80 fw3">{{post.text}}</p>
  </router-link>
</template>

<script>
export default {
  name: 'Post',
  props: ['post', 'isDraft']
}
</script>