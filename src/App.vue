<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <TimerComponent/>
</template>

<script>
import TimerComponent from './components/TimerComponent.vue';

export default {
  name: 'App',
  components: {
    TimerComponent
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
