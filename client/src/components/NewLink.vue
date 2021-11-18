<template>
    <v-dialog v-model="open" persistent max-width="700px">
      <v-card>
        <v-card-title>
            <span class="text-h5">New link</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="5" sm="6" md="5">
                        <v-text-field label="Domain" v-model="newLink.domain" required></v-text-field>
                    </v-col>
                    <v-col cols="7" sm="6" md="7">
                        <v-combobox multiple
                                v-model="newLink.aliases" 
                                label="Aliases" 
                                append-icon
                                chips
                                deletable-chips
                                class="tag-input">
                        </v-combobox>
                    </v-col>
                    <v-col cols="7" sm="6" md="7">
                        <v-text-field label="Description of link" v-model="newLink.desc" required></v-text-field>
                    </v-col>
                    <v-col cols="5" sm="6" md="5">
                        <v-text-field label="Why do you want to certify this link?" v-model="newLink.why" required></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="closeModal();newLink={}">
                Close
            </v-btn>
            <v-btn color="success" :loading="loading" text @click="createLink">
                Create
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
    props: ["open"],
    data() {
        return {
            newLink: {
                domain: '',
                aliases: [],
                desc: '',
                why: ''
            },
            loading: false
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        createLink() {
            if(!this.newLink.domain || !this.newLink.desc || !this.newLink.why) return;
            this.loading = true;
            axios({
                url: "http://localhost:4060/admin/links",
                method: "post",
                headers: {
                    Authorization: localStorage.getItem('token')
                },
                data: {
                    ...this.newLink
                }
            }).then(() => {
                this.$emit('close');
                this.loading = false;
            }).catch(err => {
                console.error(err);
                this.loading = false;
            });
        }
    }
}
</script>