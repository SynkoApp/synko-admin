<template>
    <div>
        <left-bar />
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="12">
                        <h1>Manage versions</h1>
                    </v-col>
                    <v-col cols="10">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-space-around">
                        <v-btn @click.prevent="getVersions">
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                        <v-btn @click.prevent="newReleaseModal = true" color="success">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table :headers="headers" :search="search" :items="versions" :item-class="setClass" dense :items-per-page="-1">
                {{/* eslint-disable-next-line */}}
                <template v-slot:item.version="{ item }">
                    {{ item.version }}
                    <v-chip small color="success" class="ma-1" v-if="item.version == latest.version">Latest</v-chip>
                </template>
                {{/* eslint-disable-next-line */}}
                <template v-slot:item.date="{ item }">
                    {{ new Date(item.date).toLocaleString() }}
                </template>
                {{/* eslint-disable-next-line */}}
                <template v-slot:item.hash="{ item }">
                    <pre v-if="item.hash">{{ item.hash }}</pre>
                    <v-btn v-else @click.prevent="getHash(item)" color="primary" plain rounded x-small>Récupérer le hash</v-btn>
                </template>
                {{/* eslint-disable-next-line */}}
                <template v-slot:item.action="{ item }">
                    <v-btn color="error" small icon @click.prevent="deleteVersion(item.version)">
                        <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <new-release :open="newReleaseModal" v-on:close="newReleaseModal=false"/>
    </div>
</template>

<style>
    .antiscroll>td {
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
import NewRelease from '../components/NewRelease.vue';
import {
    API_URL
} from '../config';

export default {
    data() {
        return {
            search: '',
            headers: [{
                    text: 'Version',
                    align: 'start',
                    value: 'version',
                },
                {
                    text: 'Date de publication',
                    value: 'date'
                },
                {
                    text: 'Poids',
                    value: 'size'
                },
                {
                    text: 'Hash',
                    value: 'hash'
                },
                {
                    text: 'Action',
                    value: 'action'
                }
            ],
            versions: [],
            latest: {},
            newReleaseModal: false
        }
    },
    async created() {
        this.getVersions();
    },
    methods: {
        setClass: () => {
            return 'antiscroll table-item'
        },
        async getVersions() {
            let data;
            try {
                data = (await axios({
                    method: 'get',
                    url: API_URL + '/admin/versions',
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })).data
            } catch (err) {
                console.log(err)
                //window.location.reload();
            }
            this.latest = data.latest;
            this.versions = data.versions.reverse();
        },
        async getHash(version) {
            let req = (await axios({
                method: "get",
                url: `${API_URL}/admin/hash/${version.version}`,
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })).data
            this.versions[this.versions.indexOf(version)]['hash'] = req.hash;
        },
        async deleteVersion(version) {
            let req = (await axios({
                method: "delete",
                url: `${API_URL}/admin/versions/${version}`,
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })).status
            if (req == 202) {
                this.$nextTick(() => {
                    this.getVersions();
                })
            }
        },
        async updateUserClient(user) {
            let req = (await axios({
                method: "post",
                url: `${API_URL}/admin/updateClient/${user.id}`,
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })).status
            if (req == 202) {
                this.getUsers();
            }
        },
    },
    components: {
        LeftBar,
        NewRelease
    },
}
</script>