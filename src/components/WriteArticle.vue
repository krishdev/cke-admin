<template>
	<v-container 
	 	v-resize="onResize"
		row
      	wrap :d-flex="breakpoint.Grid" grid-list-xl>
      	<v-flex xs12>
      		<v-layout  row wrap>
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
	            	<v-text-field
	                  v-model="posts.date"
	                  :error-messages="dateErrors"                  
	                  label="Date"
	                  required
	                  @input="$v.posts.date.$touch()"
	                  @blur="$v.posts.date.$touch()">                  
	                </v-text-field>
	            </v-flex>
	            <v-flex xs12 v-for="(post,index) in posts.contents">
	            	<v-card-text>
		            	<v-text-field 
			            	v-model="post.paraTitle" 
			            	label="Paragraph Title">            		
		            	</v-text-field>
		            </v-card-text>
		            <v-flex xs12>
		            	<v-text-field 
			            	v-model="post.para" 
			            	label="Paragraph">            		
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
	</v-container>
</template>
<script>
	import { validationMixin } from 'vuelidate'
  	import { required, maxLength, email } from 'vuelidate/lib/validators'
  	import { db,storageRef } from '../main'
  	
	export default {
		name: "WriteArticle",		
    	mixins: [validationMixin],    	
		data: () => ({
			posts: {
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
            },
            windowSize: {
		      x: 0,
		      y: 0
		    },
		    breakpoint: {
		    	Grid: false
		    },
		    postSuccess: false
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
	            },2000);
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
	            }
        	}
		}
	}
</script>