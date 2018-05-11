<template>
  <div id="app">
    <div class="center w85">
      <app-header></app-header>
      <div class='ph3 pv1 background-gray'>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import AppHeader from './components/AppHeader'

  export default {
    name: 'app',
    components: {
      AppHeader
    }
  }
</script>

<style>
 
</style>
