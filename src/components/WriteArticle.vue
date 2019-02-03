<template>
	<v-container 
	 	v-resize="onResize"
		row
      	wrap :d-flex="breakpoint.Grid" grid-list-xl>
      	<v-flex xs12>
      		<v-layout row wrap>
				<v-flex xs12>
				   	<v-btn
				   	  round
				      color="blue-grey"
				      class="white--text"
				      @click.prevent="showNavRight" style="margin-left: 0">
				      Select Images
				      <v-icon right dark>add_photo_alternate</v-icon>
			    	</v-btn>
					<v-text-field
	                  v-model="posts.imgPoster"
	                  :error-messages="posterErrors"                  
	                  label="Poster Source"
	                  required
	                  @input="$v.posts.imgPoster.$touch()"
	                  @blur="$v.posts.imgPoster.$touch()">                  
	                </v-text-field>
	            </v-flex>
	            <v-flex xs12>
	            	<v-text-field
	                  v-model="posts.heading"
	                  :error-messages="headingErrors"                  
	                  label="Heading"
	                  required
	                  @input="$v.posts.heading.$touch()"
	                  @blur="$v.posts.heading.$touch()">                  
	                </v-text-field>
	            </v-flex>
	            <v-flex xs12>
	            	<v-text-field
	                  v-model="posts.subTitle"
	                  :error-messages="subTitleErrors"                  
	                  label="Sub Title"
	                  required
	                  @input="$v.posts.subTitle.$touch()"
	                  @blur="$v.posts.subTitle.$touch()">                  
	                </v-text-field>
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
							readonly
							prepend-icon="event"
							@blur="date = parseDate(dateFormatted)"
						></v-text-field>
						<v-date-picker v-model="posts.date" no-title @input="menu1 = false"></v-date-picker>
					</v-menu>
	            </v-flex>
	            <v-flex xs12 v-for="post in posts.contents" :key="post.paraTitle">
	            	<v-card-text>
		            	<v-text-field 
			            	v-model="post.paraTitle" 
			            	label="Paragraph Title">            		
		            	</v-text-field>
		            </v-card-text>
		            <v-flex xs12>
						<label style="padding-bottom:5px;margin-bottom: 5px;display: inline-block;color: #8b8b8b;font-size: 16px;">Content</label>
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
	            <v-flex xs12>
	            	<v-btn @click="addArticle" color="warning">Add paragraph <v-icon right dark>add</v-icon></v-btn>
	            </v-flex>
	            <v-flex xs12>
	            	<v-alert :value="true" v-if="postSuccess" type="success">
				      The article has been successfully created.
				    </v-alert>
	            	<v-btn @click="createThePost" color="info">Create Post<v-icon right dark>create</v-icon></v-btn>		
	            </v-flex>
			</v-layout>
      	</v-flex>
		<v-dialog
			v-model="postSuccess"
			width="500"
			>
			<v-card>
				<v-card-text>
					Post Created Successfully.
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
					color="primary"
					flat
					@click="postSuccess = false"
					>
					OK
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>
<script>
	
	import { validationMixin } from 'vuelidate'
  	import { required, maxLength, email } from 'vuelidate/lib/validators'
  	import { db,storageRef } from '../main'
	  	
	export default {
		name: "WriteArticle",		
    	mixins: [validationMixin],    	
		data: vm => ({
			dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
			menu1: false,
			posts: {
                heading:"",
                subTitle:"",
				//date:"",
				date: new Date().toISOString().substr(0, 10),
                imgPoster:"",                    
                contents: [{
                    "paraTitle":"",
                    "para":"",
                    "img": {
                        imgSrc:"",
                        imgText:""
                    },
                    "showImg": false
                }]
            },
            windowSize: {
		      x: 0,
		      y: 0
		    },
		    breakpoint: {
		    	Grid: false
		    },
			postSuccess: false,
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
		mounted () {
			this.onResize()
		},
	    computed: {
	    	posterErrors () {
		        const errors = []
		        if (!this.$v.posts.imgPoster.$dirty) return errors
		        !this.$v.posts.imgPoster.required && errors.push('Image poster is required.')
		        return errors
	      	},
	      	headingErrors () {
		        const errors = []
		        if (!this.$v.posts.heading.$dirty) return errors
		        !this.$v.posts.heading.required && errors.push('Heading is required.')
		        return errors
	      	},
	      	subTitleErrors () {
		        const errors = []
		        if (!this.$v.posts.subTitle.$dirty) return errors
		        !this.$v.posts.subTitle.required && errors.push('Sub title is required.')
		        return errors
	      	},
	      	dateErrors () {
		        const errors = []
		        if (!this.$v.posts.date.$dirty) return errors
		        !this.$v.posts.date.required && errors.push('Date is required.')
		        return errors
			}		
	    },	    
	    validations:{
	        posts:{
	            heading:{
	                required
	            },
	            subTitle:{
	                required
	            },
	            date:{
	                required
	            },
	            imgPoster:{
	                required
	            }
	        }
	    },
		created () {
			this.$emit("nav-show", true, "WriteArticle", false);
		},
		methods: {
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
			onResize () {
				this.windowSize = { 
					x: window.innerWidth, 
					y: window.innerHeight 
				};
				
				if(this.windowSize.x < 1024) {
					this.breakpoint.Grid = false;
				} else if(this.windowSize.x > 1024) {
					this.breakpoint.Grid = true;
				}
			},
		   	createThePost: function () {
            
	            var self = this;
	            self.$v.posts.$touch();
	            
	            if(!self.$v.posts.$invalid) {
	                this.submited = true;
	                var db = window.db.ref();
	                db = db.child("posts");
	                var post = this.posts;
	                post.id = (post.heading+post.date).replace(/[^A-Za-z0-9]+/g,"-");
	                post.timeStamp = Math.round(new Date().getTime()/1000);
	                db.push(post);
	                self.postSuccess = true;
	                self.reset();
	            }

	            setTimeout(function() {
	            	self.postSuccess = false;
	            },3000);
	        },
	        showNavRight: function () {
	        	this.$emit("nav-show-right", true);
	        },
	        addArticle: function () {
	            this.posts.contents.push({
	                "paraTitle":"",
	                "para":"",
	                "img": {
	                    imgSrc:"",
	                    imgText:""
	                },
	                "showImg": false
	            })
	        },
         	reset: function () {
	            this.posts = {
	                heading:"",
	                subTitle:"",
	                date:"",
	                imgPoster:"",
	                contents: [{
	                    "paraTitle":"",
	                    "para":"",
	                    "img": {
	                        imgSrc:"",
	                        imgText:""
	                    },
	                    "showImg": false
	                }]
				};
				this.$v.$reset();
        	}
		},
		watch: {
			'posts.date' (val) {
				this.dateFormatted = this.formatDate(val);
			}
		}
	}
</script>
<style>

</style>