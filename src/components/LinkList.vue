<template>
  <div>
    <div>
      <link-item
        v-for="(link, index) in orderedLinks"
        :key="link.id"
        :link="link"
        :index="index"
        :pageNumber="pageNumber">
      </link-item>
    </div>
    <div v-if="isNewPage">
      <button v-show="!isFirstPage" @click="previousPage()">Previous</button>
      <button v-show="morePages" @click="nextPage()">Next</button>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  import { ALL_LINKS_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from '../constants/graphql'
  import { LINKS_PER_PAGE } from '../constants/settings'
  import LinkItem from './LinkItem'

  export default {
    name: 'LinkList',
    data () {
      return {
        allLinks: null,
        count: 0,
        loading: 0
      }
    },
    computed: {
      orderedLinks: function () {
        if (this.allLinks) {
          if (this.$route.path.includes('top')) {
            return _.orderBy(this.allLinks.feed.links, 'votes.length').reverse()
          } else {
            return this.allLinks.feed.links
          }
        }
      },
      isFirstPage () {
        return this.$route.params.page === '1'
      },
      isNewPage () {
        return this.$route.path.includes('new')
      },
      pageNumber (index) {
        return parseInt(this.$route.params.page, 10)
      },
      morePages () {
        return parseInt(this.$route.params.page, 10) < this.count / LINKS_PER_PAGE
      }
    },
    components: {
      LinkItem
    },
    methods: {
      getLinksToRender (isNewPage) {
        console.log(this.$apollo.queries.feed)
        if (isNewPage) {
          return this.$apollo.queries.feed
        }
        const rankedLinks = this.$apollo.queries.feed.slice()
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
        return rankedLinks
      },
      nextPage () {
        const page = parseInt(this.$route.params.page, 10)
        if (page < this.count / LINKS_PER_PAGE) {
          const nextPage = page + 1
          this.$router.push({path: `/new/${nextPage}`})
        }
      },
      previousPage () {
        const page = parseInt(this.$route.params.page, 10)
        if (page > 1) {
          const previousPage = page - 1
          this.$router.push({path: `/new/${previousPage}`})
        }
      }
    },
    apollo: {
      allLinks: {
        query: ALL_LINKS_QUERY,
        variables () {
          const page = parseInt(this.$route.params.page, 10)
          const isNewPage = this.$route.path.includes('new')
          const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
          const first = isNewPage ? LINKS_PER_PAGE : 100
          const orderBy = isNewPage ? 'createdAt_DESC' : null
          return {
            first,
            skip,
            orderBy
          }
        },
        update (data) {
          this.count = data.feed.count
          return data
        },
        subscribeToMore: [
          {
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (previous, { subscriptionData }) => {
              const newAllLinks = [
                subscriptionData.data.newLink.node,
                ...previous.feed.links
              ]
              const result = {
                ...previous,
                feed: {
                  ...previous.feed,
                  links: newAllLinks
                }
              }
              return result
            }
          },
          {
            document: NEW_VOTES_SUBSCRIPTION,
            updateQuery: (previous, { subscriptionData }) => {
              const votedLinkIndex = previous.feed.links.findIndex(link => link.id === subscriptionData.data.newVote.node.link.id)
              const link = subscriptionData.data.newVote.node.link
              const newAllLinks = previous.feed.links.slice()
              newAllLinks[votedLinkIndex] = link
              const result = {
                ...previous,
                feed: {
                  ...previous.feed,
                  links: newAllLinks
                }
              }
              return result
            }
          }
        ]
      }
    }
  }
</script>
