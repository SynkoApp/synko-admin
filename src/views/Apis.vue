<template>
  <div>
    <left-bar/>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12">
            <h1>APIS</h1>
          </v-col>
          <v-col cols="10">
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          </v-col>
          <v-col cols="2" class="d-flex justify-space-around">
            <v-btn @click.prevent="getRoutes">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table :headers="headers" :search="search" :items="routes" :item-class="setClass" dense>
        {{/* eslint-disable-next-line */}}
        <template v-slot:item.actions="{ item }">
          <v-btn :color="item.state ? 'success' : 'error'" small icon @click="item.state ? enableEndpoint(item) : disableEndpoint(item)">
            <v-icon small>mdi-cancel</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<style>
  .antiscroll>td{
    max-width: 290px;
    text-align: center !important;
  }

  .table-item:hover {
    background: rgba(255, 255, 255, 0.1) !important;
  }
</style>

<script>
import axios from 'axios'
import LeftBar from '../components/LeftBar.vue';
import { API_URL } from '../config';

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Route',
          align: 'start',
          value: 'route',
        },
        { text: "Method", value: "method" },
        { text: 'Usage', value: 'usage' },
        { text: 'Admin needed ?', value: 'admin' },
        { text: 'Actions', value : 'actions' }
      ],
      routes: []
    }
  },
  async created (){
    this.getRoutes();
  },
  methods : {
    setClass : () => {
      return 'antiscroll table-item'
    },
    async getRoutes() {
      let routes;
      try {
        routes = (await axios({
          method : 'get',
          url : API_URL+'/admin/apis',
          headers : {
            Authorization : localStorage.getItem('token')
          }
        })).data.routes
        routes.forEach(element => {
          console.log(element.state)
        });
      } catch(err) {
        console.log(err)
        //window.location.reload();
      }
      this.routes = routes
    },
    disableEndpoint(api){
      console.log('ok')
      axios({
        method: "put",
        url: API_URL+"/admin/apis",
        headers : {
          Authorization : localStorage.getItem('token')
        },
        data: {
          route: api.route,
          method: api.method
        }
      })
    },
    enableEndpoint(api){
      axios({
        method: "patch",
        url: API_URL+"/admin/apis",
        headers : {
          Authorization : localStorage.getItem('token')
        },
        data: {
          route: api.route,
          method: api.method
        }
      })
    }
  },
  components: { LeftBar },
}
</script>
