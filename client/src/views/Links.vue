<template>
    <div>
        <left-bar/>
        <v-card>
            <v-card-title>
                <v-row>
                <v-col cols="12">
                    <h1>Certified URLs</h1>
                </v-col>
                <v-col cols="10">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                </v-col>
                <v-col cols="2" class="d-flex justify-space-around">
                    <v-btn @click.prevent="getLinks">
                    <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                    <v-btn @click.prevent="newLinkModal = true" color="success">
                    <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
                </v-row>
            </v-card-title>
            <v-data-table :headers="headers" :search="search" :items="links" :item-class="setClass" dense>
                {{/* eslint-disable-next-line */}}
                <template v-slot:item.aliases="{ item }">
                    <v-chip class="ma-1" v-for="i in item.aliases" :key="i">{{ i }}</v-chip>
                </template>
                {{/* eslint-disable-next-line */}}
                <template v-slot:item.actions="{ item }">
                    <v-btn color="primary" small icon @click="editLinkModal=true;currentLink=item;currentLink.key=Math.floor(Math.random()*Date.now())">
                        <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn color="error" small icon @click="deleteLink(item)">
                        <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <new-link :open="newLinkModal" v-on:close="newLinkModal=false"/>
        <edit-link :open="editLinkModal" :link="currentLink" v-on:close="editLinkModal=false"/>
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
import NewLink from '../components/NewLink.vue';
import EditLink from '../components/EditLink.vue';

export default {
    data () {
        return {
            search: '',
            headers: [
                {
                    text: 'Domain',
                    align: 'start',
                    value: 'domain',
                },
                { text: 'Aliases', value: 'aliases' },
                { text: 'Desc', value: 'desc' },
                { text: 'Why ?', value: 'why' },
                { text: 'Usages', value: 'uses' },
                { text: 'Certified by', value: 'certifier' },
                { text: 'Date', value: 'date' },
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
            links: [],
            currentLink: {},
            editLinkModal: false,
            newLinkModal: false
        }
    },
    async created (){
        this.getLinks();
    },
    methods : {
        setClass : () => {
            return 'antiscroll table-item'
        },
        async getLinks() {
            let links;
            try {
                links = (await axios({
                    method : 'get',
                    url : 'http://localhost:4060/admin/links',
                    headers : {
                        Authorization : localStorage.getItem('token')
                    }
                })).data
            } catch(err) {
                console.log(err)
                //window.location.reload();
            }
            this.links = links;
        },
        async deleteLink(link) {
            let req = (await axios({
                method: "delete",
                url : `http://localhost:4060/admin/links`,
                headers : {
                    Authorization : localStorage.getItem('token')
                },
                data: {
                    id: link.domain
                }
            })).status
            if(req == 202) {
                this.getLinks();
            }
        },
    },
    components: { LeftBar, NewLink, EditLink },
}
</script>