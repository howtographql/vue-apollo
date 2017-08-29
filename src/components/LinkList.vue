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
        allLinks: [],
        count: 0,
        loading: 0
      }
    },
    computed: {
      orderedLinks: function () {
        if (this.$route.path.includes('top')) {
          return _.orderBy(this.allLinks, 'votes.length').reverse()
        } else {
          return this.allLinks
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
        if (isNewPage) {
          return this.$apollo.queries.allLinks
        }
        const rankedLinks = this.$apollo.queries.allLinks.slice()
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
          this.count = data._allLinksMeta.count
          return data.allLinks
        },
        subscribeToMore: [
          {
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (previous, { subscriptionData }) => {
              const newAllLinks = [
                subscriptionData.data.Link.node,
                ...previous.allLinks
              ]
              const result = {
                ...previous,
                allLinks: newAllLinks.slice(0, 5)
              }
              return result
            }
          },
          {
            document: NEW_VOTES_SUBSCRIPTION,
            updateQuery: (previous, { subscriptionData }) => {
              const votedLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Vote.node.link.id)
              const link = subscriptionData.data.Vote.node.link
              const newAllLinks = previous.allLinks.slice()
              newAllLinks[votedLinkIndex] = link
              const result = {
                ...previous,
                allLinks: newAllLinks
              }
              return result
            }
          }
        ]
      }
    }
  }
</script>
