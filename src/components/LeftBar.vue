<template>
    <v-navigation-drawer permanent expand-on-hover absolute>
        <v-list>
            <v-list-item link>
                <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        {{user.username ? user.username : "Admin"}}
                    </v-list-item-title>
                    <v-list-item-subtitle>Administrator</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list nav dense>
            <v-list-item link to="/">
                <v-list-item-icon>
                    <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Users</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/links">
                <v-list-item-icon>
                    <v-icon>mdi-shield-link-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Certified URLs</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/online">
                <v-list-item-icon>
                    <v-icon>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Online users</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/versions">
                <v-list-item-icon>
                    <v-icon>mdi-folder-sync</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Manage Versions</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/apis">
                <v-list-item-icon>
                    <v-icon>mdi-api</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Manage APIS</v-list-item-title>
            </v-list-item>
        </v-list>
        <template v-slot:append>
            <v-list nav dense>
                <v-list-item :to="{ name: 'Logout' }" color="red" :input-value="true">
                    <v-list-item-icon>
                        <v-icon color="red">mdi-power</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
            </v-list>
        </template>
      </v-navigation-drawer>
</template>

<script>
import axios from 'axios';
import { API_URL } from '../config';

export default {
    data() {
        return {
            user: {}
        }
    },
    async created() {
        let req = (await axios({
            method: "get",
            url: API_URL + "/users/@me",
            headers: {
              Authorization: `${localStorage.getItem('token')}`
            }
        })).data;
        this.user = req;
    }
}
</script>