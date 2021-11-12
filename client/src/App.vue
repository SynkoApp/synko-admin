<template>
  <v-app>
    <v-main>
      <router-view class="pl-16 pr-2 py-2"/>
    </v-main>
  </v-app>
</template>

<style>
  html{
    overflow: hidden;
  }
</style>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
