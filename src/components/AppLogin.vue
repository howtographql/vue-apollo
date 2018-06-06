<template>
  <div>
    <h4 class='mv3'>{{login ? 'Login' : 'Sign Up'}}</h4>
    <div class='flex flex-column'>
      <input
        v-show="!login"
        v-model="name"
        type="text"
        placeholder="Your name">
      <input
        v-model="email"
        type="text"
        placeholder="Your email address">
      <input
        v-model="password"
        type="password"
        placeholder="Password">
    </div>
    <div class='flex mt3'>
      <div
        class='pointer mr2 button'
        @click="confirm()">
        {{login ? 'login' : 'create account'}}
      </div>
      <div
        class='pointer button'
        @click="login = !login">
        {{login ? 'need to create an account?' : 'already have an account?'}}
      </div>
    </div>
  </div>
</template>

<script>
  import { CREATE_USER_MUTATION, SIGNIN_USER_MUTATION } from '../constants/graphql'
  import { AUTH_TOKEN, USER_ID } from '../constants/settings'

  export default {
    name: 'AppLogin',
    data () {
      return {
        email: '',
        login: true,
        name: '',
        password: ''
      }
    },
    methods: {
      confirm () {
        const { name, email, password } = this.$data
        if (this.login) {
          this.$apollo.mutate({
            mutation: SIGNIN_USER_MUTATION,
            variables: {
              email,
              password
            }
          }).then((result) => {
            const id = result.data.login.user.id
            const { token } = result.data.login
            this.saveUserData(token, id)
          }).catch((error) => {
            alert(error)
          })
        } else {
          this.$apollo.mutate({
            mutation: CREATE_USER_MUTATION,
            variables: {
              name,
              email,
              password
            }
          }).then((result) => {
            const id = result.data.signup.user.id
            const { token } = result.data.signup
            console.log(id, token)
            this.saveUserData(token, id)
          }).catch((error) => {
            alert(error)
          })
        }
        this.$router.push({path: '/'})
      },
      saveUserData (token, id) {
        localStorage.setItem(USER_ID, id)
        localStorage.setItem(AUTH_TOKEN, token)
        this.$root.$data.userId = localStorage.getItem(USER_ID)
      }
    }
  }
</script>
