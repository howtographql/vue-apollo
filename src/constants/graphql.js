import gql from 'graphql-tag'

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      text
      title
      isPublished
    }
  }
`
export const DRAFTS_QUERY = gql`
  query DraftsQuery {
    drafts {
      id
      text
      title
      isPublished
    }
  }
`

export const CREATE_DRAFT_MUTATION = gql`
  mutation CreateDraftMutation($title: String!, $text: String!) {
    createDraft(title: $title, text: $text) {
      id
      title
      text
    }
  }
`

export const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title
      text
      isPublished
    }
  }
`

export const PUBLISH_MUTATION = gql`
  mutation PublishMutation($id: ID!) {
    publish(id: $id) {
      id
      isPublished
    }
  }
`

export const DELETE_MUTATION = gql`
  mutation DeleteMutatoin($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`
