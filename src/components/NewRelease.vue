<template>
    <v-dialog v-model="open" persistent max-width="700px">
      <v-card>
        <v-card-title>
            <span class="text-h5">New release</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6" md="6">
                        <v-text-field label="Version" v-model="newRelease.version" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-file-input ref="files" label="Files" hint="latest.yml, blockmap file and setup file" chips counter clearable multiple @change="releaseHandler" show-size truncate-length="15"></v-file-input>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="closeModal();newRelease={}">
                Close
            </v-btn>
            <v-btn color="success" :loading="loading" text @click="createRelease">
                Create
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
/*import axios from 'axios';
import { API_URL } from '../config';*/
import yaml  from "js-yaml";
import axios from 'axios';
import { API_URL } from '../config';

export default {
    props: ["open"],
    data() {
        return {
            newRelease: {
                version: '',
                files: [],
            },
            loading: false
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        releaseHandler(files) {
            let latestFile = files.find(f => f.name == "latest.yml");
            if(latestFile) {
                let reader = new FileReader();
                reader.onload = (res) => {
                    let latest = yaml.load(res.target.result);
                    this.newRelease.version = latest.version;
                    this.newRelease.files = files;
                }
                reader.readAsText(latestFile);
            }
        },
        createRelease() {
            console.log(this.newRelease)
            if(!this.newRelease.version || this.newRelease.files.length < 3) return;
            this.loading = true;
            let data = new FormData();
            data.append("version", this.newRelease.version);
            for (let i = 0; i < this.newRelease.files.length; i++) {
                let file = this.newRelease.files[i];
                data.append(`File`, file);
            }
            axios({
                url: API_URL + "/upload",
                method: "post",
                headers: {
                    Authorization: "U2FsdGVkX1+jJ7Kwcg85k3TwkmxBLFkDv80rnqDvv7Y",
                    "Content-Type": "multipart/form-data"
                },
                data
            }).then(() => {
                this.$emit('close');
                this.loading = false;
            }).catch(console.error);
            /*if(!this.newUser.username || !this.newUser.email || !this.newUser.password) return;
            this.loading = true;
            axios({
                url: API_URL + "/admin/createUser",
                method: "post",
                headers: {
                    Authorization: localStorage.getItem('token')
                },
                data: {
                    ...this.newUser
                }
            }).then(() => {
                this.$emit('close');
                this.loading = false;
            }).catch(console.error);*/
        }
    }
}
</script>