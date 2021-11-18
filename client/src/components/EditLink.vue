<template>
    <v-dialog v-model="open" persistent max-width="700px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit {{localLink.domain}}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-row>
                            <v-col cols="11">
                                <v-text-field label="Domain" required v-model="localLink.domain" disabled></v-text-field>
                            </v-col>
                            <v-col cols="1">
                                <v-btn fab small class="mt-3" @click="copy(localLink.domain)">
                                <v-icon small>mdi-content-copy</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-combobox multiple
                                        v-model="localLink.aliases" 
                                        label="Aliases" 
                                        append-icon
                                        chips
                                        deletable-chips
                                        class="tag-input">
                                </v-combobox>
                            </v-col>
                            <v-col cols="7" sm="6" md="7">
                                <v-text-field label="Description of link" v-model="localLink.desc" required></v-text-field>
                            </v-col>
                            <v-col cols="5" sm="6" md="5">
                                <v-text-field label="Why do you want to certify this link?" v-model="localLink.why" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="$emit('close');localLink={}">
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
export default {
    props: ["open", "link"],
    watch: {
        link(){
            this.setLink();
        }
    },
    data() {
        return {
            localLink: Object.assign({}, this.link),
            loading: false
        }
    },
    methods: {
        setLink() {
            this.localLink = Object.assign({}, this.link);
        },
        closeModal() {
            this.$emit('close');
        },
        save() {
            let edited = diff(this.link, this.localLink);
            if(edited == {}) return;
            let link = JSON.parse(JSON.stringify(Object.assign({}, {
                domain: edited.domain,
                aliases: edited.aliases,
                desc: edited.desc,
                why: edited.why
            })));
            this.loading = true;
            axios({
                url: `http://localhost:4060/admin/links`,
                method: "patch",
                headers: {
                    Authorization: localStorage.getItem('token')
                },
                data: { 
                    id: this.link.domain,
                    link
                }
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
        console.log(diff)
        if (o1[key] === o2[key]) return diff
        if (Array.isArray(o2[key]) && JSON.stringify(o2[key]) != JSON.stringify(o1[key])) return {
            ...diff,
            [key]: o2[key]
        };
        return {
            ...diff,
            [key]: o2[key]
        }
    }, {})
}
</script>