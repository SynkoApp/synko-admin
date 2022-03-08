<template>
    <v-dialog v-model="open" persistent max-width="700px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit {{localUser.name}}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                    <v-col cols="11">
                        <v-text-field label="ID" required v-model="localUser.ID" disabled></v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-btn fab small class="mt-3" @click="copy(localUser.ID)">
                        <v-icon small>mdi-content-copy</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Username" v-model="localUser.name" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Email" v-model="localUser.mail" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-select v-model="localUser.perms" label="Permissions" :items="permissions" item-text="name" item-value="value" required></v-select>
                    </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="$emit('close');localUser={}">
                    Close
                </v-btn>
                <v-btn color="success" text @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import { API_URL } from '../config';

export default {
    props: ["open", "user"],
    watch: {
        user(){
            this.setUser();
        }
    },
    data() {
        return {
            localUser: Object.assign({}, this.user),
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
        setUser() {
            this.localUser = Object.assign({}, this.user);
        },
        closeModal() {
            this.$emit('close');
        },
        save() {
            let edited = diff(this.user, this.localUser);
            if(edited == {}) return;
            let user = JSON.parse(JSON.stringify(Object.assign({}, {
                username: edited.name,
                email: edited.mail,
                permissions: edited.perms
            })));
            this.loading = true;
            axios({
                url: API_URL + `/admin/edit/${this.user.ID}`,
                method: "patch",
                headers: {
                    Authorization: localStorage.getItem('token')
                },
                data: { user }
            }).then(() => {
                this.$emit('close');
                this.loading = false;
            }).catch(console.error);
        },
        copy(text) {
            if(navigator.clipboard) {
                navigator.clipboard.writeText(text);
            } else {
                var textArea = document.createElement("textarea");
                textArea.value = text
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                } catch (err) {
                    console.log('Oops, unable to copy');
                }
                document.body.removeChild(textArea);          
            }
        },
    }
}

function diff(o1, o2) {
    return Object.keys(o2).reduce((diff, key) => {
        if (o1[key] === o2[key]) return diff
        return {
            ...diff,
            [key]: o2[key]
        }
    }, {})
}
</script>