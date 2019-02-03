<template>
  <v-content style="padding:0">
    <v-dialog v-model="dialog" max-width="900px">
      <v-alert
        v-model="isEditLoading"
        dismissible
        type="success"
        class="editArticleSuccess"
      >
        Your changes are getting saved. Please wait.
      </v-alert>
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
                <v-menu
                  ref="menu1"
                  :close-on-content-click="false"
                  v-model="menu1"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="dateFormatted"
                    label="Date"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    prepend-icon="event"
                    @blur="date = parseDate(dateFormatted)"
                  ></v-text-field>
                  <v-date-picker v-model="editedItem.date" no-title @input="menu1 = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 v-for="(post,index) in editedItem.contents" :key="index">
                <v-card-text>
                  <v-text-field 
                    v-model="post.paraTitle" 
                    label="Paragraph Title">                
                  </v-text-field>
                </v-card-text>
                <v-flex xs12>                  
                  <quill-editor v-model="post.para" :options="editorOption"></quill-editor>
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
        </td>
      </template>
    </v-data-table>
    <v-dialog
      v-model="editSuccess"
      width="500"
      >
      <v-card>
      <v-card-text>
        Post Edited Successfully.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
        color="primary"
        flat
        @click="editSuccess = false"
        >
        OK
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>
<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  import { db } from '../main'
  import moment from "moment"
  
  export default {
    data: () => ({
      dateFormatted:'',
      date:'',
			menu1: false,
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
      isEditLoading: false,
      editorOption: {
				modules: {
					toolbar: [
					['bold', 'italic', 'underline', 'strike'],
					['blockquote', 'code-block'],
					[{ 'header': 1 }, { 'header': 2 }],
					[{ 'list': 'ordered' }, { 'list': 'bullet' }],
					[{ 'script': 'sub' }, { 'script': 'super' }],
					[{ 'indent': '-1' }, { 'indent': '+1' }],
					[{ 'direction': 'rtl' }],
					[{ 'size': ['small', false, 'large', 'huge'] }],
					[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
					[{ 'font': [] }],
					[{ 'color': [] }, { 'background': [] }],
					[{ 'align': [] }],
					['clean'],
					['link', 'video']
					],
					syntax: {
					highlight: text => hljs.highlightAuto(text).value
					}
				}
			}
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
                isDateValid(date){return moment(date, 'YYYY-MM-DD').isValid();}
            },
            imgPoster:{
                required
            }
        }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
			'editedItem.date' (val) {
        this.dateFormatted = this.formatDate(val);
			}		
    },
    created () {
      this.getAllArticle();     
    },

    methods: {
      getAllArticle () {
        var self = this;
        self.articles = [];
        var ref = db.ref();
        ref.child("posts").orderByChild("timeStamp").on("child_added", function(response){              
            self.articles.push(response.val());          
        }) 
      },
      formatDate (date) {
				if (!date) return null

				const [year, month, day] = date.split('-')
				return `${day}/${month}/${year}`
			},
			parseDate (date) {
				if (!date) return null

				const [month, day, year] = date.split('/')
				return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`
			},
      editItem (item) {
        this.editedIndex = this.articles.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.date = this.formatDate(this.editedItem.date);
        this.dialog = true;
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
          self.isEditLoading = true;
          dbRef.orderByChild("id").equalTo(post.id).on("child_added", function(snapshot) {          
            
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
              
              self.editSuccess = true;    
              self.isEditLoading = false;                                
              self.close();
              self.getAllArticle();
              setTimeout(function(){
              self.editSuccess = false;
              },2000);
            });          
          });   
        }
        //this.close()
      }
    }
  }
</script>
<style>

</style>