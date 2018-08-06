<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  body{
    height: 100%;
    width: 100%;
    position: absolute;
  }
  body,p,ul,li{
    margin: 0;
    padding: 0;
  }
  a{
    color: #666;
    text-decoration: none;
  }
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-size: 14px;
    height: 100%;
    color: #666;
    box-sizing: border-box;
  }
</style>
