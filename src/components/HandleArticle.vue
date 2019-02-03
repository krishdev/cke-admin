<template>
  <v-content style="padding:0">
    <v-dialog v-model="dialog" max-width="900px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="editedItem.imgPoster" label="Poster Image"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editedItem.heading" label="Heading"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editedItem.subTitle" label="Sub Title"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editedItem.date" label="Date"></v-text-field>
              </v-flex>
              <v-flex xs12 v-for="(post,index) in editedItem.contents" :key="index">
                <v-card-text>
                  <v-text-field 
                    v-model="post.paraTitle" 
                    label="Paragraph Title">                
                  </v-text-field>
                </v-card-text>
                <v-flex xs12>
                  <v-text-field 
                    v-model="post.para" 
                    label="Paragraph"
                    textarea>                
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-layout  row wrap>
                    <v-flex xs12 md5 v-show="post.showImg" >
                      <v-text-field 
                        v-model="post.img.imgSrc" 
                        label="Image Url">                
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 md5 v-show="post.showImg">
                      <v-text-field 
                        v-model="post.img.imgText" 
                        label="Image description">                
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  
                  <v-btn style="margin-left: 0;"  @click="post.showImg = !post.showImg" color="success">
                    <span v-show="!post.showImg">Add Image<v-icon right dark>add</v-icon></span>
                          <span v-show="post.showImg">Hide Image<v-icon right dark>remove</v-icon></span>      
                  </v-btn>
                </v-flex>             
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-flex v-if="isEditLoading" xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </v-flex>
          <v-flex v-if="isEditLoading" xs12>            
            <v-alert :value="true" v-if="editSuccess" type="success">
                The article has been successfully updated.
            </v-alert> 
          </v-flex>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save(editedItem)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headerArticle"
      :items="articles"
      hide-actions
      class="elevation-1 rowTable">
      <template slot="items" slot-scope="article">
        <td>{{ article.item.heading }}</td>
        <td class="text-xs-right">{{ article.item.date }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(article.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <!-- <v-btn icon class="mx-0" @click="deleteItem(article.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn> -->
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </v-content>
</template>
<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  import { db } from '../main'
  import moment from "moment"
  export default {
    data: () => ({
      articles: [],
      dialog: false,
      headerArticle: [
        {
          text:"Articles",
          sortable: false
        },
        {
          text:"",
          sortable: false
        },
        {
          text:" ",
          sortable: false,
          id:"dds"
        }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        imgPoster: '',
        heading: 0,
        subTitle: 0,
        date: 0,
        contents: []
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      editSuccess: false,
      isEditLoading: false
    }),
    mixins: [validationMixin],
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },
    validations:{
        editedItem:{
            heading:{
                required
            },
            subTitle:{
                required
            },
            date:{
                required,
                isDateValid(date){return moment(date, 'DD/MM/YYYY').isValid();}
            },
            imgPoster:{
                required
            }
        }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      
      var self = this;
      var ref = db.ref();
      ref.child("posts").orderByChild("timeStamp").on("child_added", function(response){              
          self.articles.push(response.val());          
      }) 
    },

    methods: {     
      editItem (item) {
        this.editedIndex = this.articles.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save (postt) {
        var dbRef = db.ref("posts");
        var key;
        var self = this;        
        var post = postt;
        if(!this.$v.editedItem.$invalid) {
          dbRef.orderByChild("id").equalTo(post.id).on("child_added", function(snapshot) {          
            
            self.isEditLoading = true;
            key = snapshot.key;
            var update = {};
            update[key] = {
              "imgPoster" : post.imgPoster,
              "heading" : post.heading,
              "subTitle" : post.subTitle,
              "date" : post.date,
              "contents" : post.contents,
              "id": post.id
            };
            db.ref("posts").update(update, function(response){
              
              self.isEditLoading = false;          
              self.editSuccess = true;                      
              setTimeout(function(){
                self.editSuccess = false;
                self.close();
              },2000);
            });          
          });   
        }
        //this.close()
      }
    }
  }
</script>