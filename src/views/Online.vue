<template>
  <div>
    <left-bar/>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12">
            <h1>Online users</h1>
          </v-col>
          <v-col cols="10">
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          </v-col>
          <v-col cols="2" class="d-flex justify-space-around">
            <v-btn @click.prevent="getUsers">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn @click.prevent="newUserModal = true" color="success">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table :headers="headers" :search="search" :items="users" :item-class="setClass" dense>
        {{/* eslint-disable-next-line */}}
        <template v-slot:item.actions="{ item }">
          <v-btn color="error" small icon @click="disconnectUser(item)">
            <v-icon small>mdi-connection</v-icon>
          </v-btn>
          <v-btn color="error" small icon @click="closeSynkoForUser(item)">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <edit-user :open="editUserModal" :user="currentUser" v-on:close="currentUser={};editUserModal=false"/>
    <new-user :open="newUserModal" v-on:close="newUserModal=false"/>
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
import NewUser from '../components/NewUser.vue'
import EditUser from '../components/EditUser.vue';
import { API_URL } from '../config';

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Username',
          align: 'start',
          value: 'username',
        },
        { text: 'ID', value: 'id' },
        { text: 'Profile pic', value: 'profilePic' },
        { text: 'Groups', value: 'groups' },
        { text: 'E-mail', value: 'email' },
        { text: 'Permissions', value: 'permissions' },
        { text: 'Badges', value: 'badges' },
        { text: 'Actions', value : 'actions' }
      ],
      permissions: [
        {
          name: "Administrator",
          value: 1
        },
        {
          name: "User",
          value: 0
        }
      ],
      users: [],
      currentUser: {},
      editUserModal: false,
      newUserModal: false
    }
  },
  async created (){
    this.getUsers();
  },
  methods : {
    setClass : () => {
      return 'antiscroll table-item'
    },
    async getUsers() {
      let users;
      try {
        users = (await axios({
          method : 'get',
          url : API_URL+'/admin/onlineUsers',
          headers : {
            Authorization : localStorage.getItem('token')
          }
        })).data.users
        console.log(users)
      } catch(err) {
        console.log(err)
        //window.location.reload();
      }
      this.users = users
    },
    async deleteUser(user) {
      let req = (await axios({
        method: "delete",
        url : `${API_URL}/admin/users/${user.ID}`,
        headers : {
          Authorization : localStorage.getItem('token')
        }
      })).status
      if(req == 202) {
        this.getUsers();
      }
    },
    async disconnectUser(user) {
      let req = (await axios({
        method: "post",
        url : `${API_URL}/admin/disconnectUser/${user.id}`,
        headers : {
          Authorization : localStorage.getItem('token')
        }
      })).status
      if(req == 202) {
        this.getUsers();
      }
    },
  },
  components: { LeftBar, NewUser, EditUser },
}
</script>
