<template>
    <v-dialog v-model="open" persistent max-width="700px">
      <v-card>
        <v-card-title>
            <span class="text-h5">New user</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="5" sm="6" md="5">
                        <v-text-field label="Username" v-model="newUser.username" required></v-text-field>
                    </v-col>
                    <v-col cols="7" sm="6" md="7">
                        <v-text-field label="Email" v-model="newUser.email" required></v-text-field>
                    </v-col>
                    <v-col cols="7" sm="6" md="7">
                        <v-text-field type="password" label="Password" v-model="newUser.password" required></v-text-field>
                    </v-col>
                    <v-col cols="5" sm="6" md="5">
                        <v-select v-model="newUser.permissions" label="Permissions" :items="permissions" item-text="name" item-value="value" required></v-select>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="closeModal();newUser={}">
                Close
            </v-btn>
            <v-btn color="success" :loading="loading" text @click="createUser">
                Create
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import { API_URL } from '../config';

export default {
    props: ["open"],
    data() {
        return {
            newUser: {
                username: '',
                email: '',
                password: '',
                permissions: 0
            },
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
            loading: false
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        createUser() {
            if(!this.newUser.username || !this.newUser.email || !this.newUser.password) return;
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
            }).catch(console.error);
        }
    }
}
</script>