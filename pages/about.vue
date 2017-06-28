<template>
  <section class="container">
    <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      This page is loaded from the {{ name }} {{titled}}
    </h1>
    <h2 class="info" v-if="name === 'client'">
      Please refresh the page
    </h2>
    <nuxt-link class="button" to="/">
      Home page
    </nuxt-link>
  </section>
</template>
<script>
import axios from "axios";
export default {
  constructor(){
    console.log(test);
  },
  asyncData ({ req }) {
    return axios.get("/mk")
      .then((res)=>{
        return res.data;
      });
    // return {
    //   name: req ? 'server' : 'client'
    // }
  },
  data(){
    return {
      name: "askklmlk",
      titled: '快快快'
    }
  },
  head () {
    return {
      title: `About Page (${this.name}-side)`
    }
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
