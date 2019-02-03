<template>
	<v-container
		row
      	wrap grid-list-xl>
      	<v-flex xs12>
      		<v-layout  row wrap>
      			<h3>Create Timeline</h3>
	            <v-flex xs12>
	            	<v-text-field
	                  v-model="timeline.description"
	                  :error-messages="descriptionErrors"                  
	                  label="Description"
	                  required
	                  @input="$v.timeline.description.$touch()"
	                  @blur="$v.timeline.description.$touch()">                  
	                </v-text-field>
	            </v-flex>
	            <v-flex xs12>
	            	<v-select
		                :items="['Bookish','Sports','General', 'Culturals']"
		                v-model="timeline.activity"
		                :error-messages="activityErrors"
		                label="Activity"
		                item-value="text"
	              	></v-select>
	            </v-flex>
	            <v-flex xs12>
	            	<v-text-field
	                  v-model="timeline.date"
	                  :error-messages="dateErrors"                  
	                  label="Date (dd/mm/yyyy)"
	                  required
	                  @input="$v.timeline.date.$touch()"
	                  @blur="$v.timeline.date.$touch()">                  
	                </v-text-field>
	            </v-flex>
	            <v-flex xs12>
	            	<v-alert :value="true" v-if="postSuccess" type="success">
				      The timeline has been successfully created.
				    </v-alert>
	            	<v-btn @click="createTimeline" color="info" style="margin-left:0;">Create Timeline<v-icon right dark>create</v-icon></v-btn>		
	            </v-flex>
			</v-layout>
			<v-spacer></v-spacer>
			<v-layout  row wrap>
				<h3>Create Press</h3>
	            <v-flex xs12>
	            	<v-text-field
	                  v-model="press.title"
	                  :error-messages="titleErrors"                  
	                  label="Title"
	                  required
	                  @input="$v.press.title.$touch()"
	                  @blur="$v.press.title.$touch()">                  
	                </v-text-field>
	            </v-flex>
	            <v-flex xs12>
	            	<v-text-field
	                  v-model="press.url"
	                  :error-messages="urlErrors"                  
	                  label="Url"
	                  required
	                  @input="$v.press.url.$touch()"
	                  @blur="$v.press.url.$touch()">                  
	                </v-text-field>
	            </v-flex>	            
	            <v-flex xs12>
	            	<v-text-field
	                  v-model="press.date"
	                  :error-messages="datePressErrors"                  
	                  label="Date (dd/mm/yyyy)"
	                  required
	                  @input="$v.press.date.$touch()"
	                  @blur="$v.press.date.$touch()">                  
	                </v-text-field>
	            </v-flex>
	            <v-flex xs12>
	            	<v-alert :value="true" v-if="postpressSuccess" type="success">
				      The Press has been successfully created.
				    </v-alert>
	            	<v-btn @click="createPress" color="green" style="margin-left:0;">Create Press<v-icon right dark>create</v-icon></v-btn>		
	            </v-flex>
			</v-layout>
      	</v-flex>		
	</v-container>
</template>
<script>
	import { validationMixin } from 'vuelidate'
  	import { required, maxLength, email } from 'vuelidate/lib/validators'
  	import { db,storageRef } from '../main'
	import moment from "moment"
	  
	export default {
		name: "WriteArticle",		
    	mixins: [validationMixin],    	
		data: () => ({
			timeline: {
                id:"",
                date:"",
                description:"",
				activity:"",
				status: true
            },
            press: {
                id:"",
                date:"",
                url:"",
				title:"",
				status: true
            },
		    breakpoint: {
		    	Grid: false
		    },
		    postSuccess: false,
		    postpressSuccess: false
		}),
		mounted () {
			
		},
	    computed: {
	    	descriptionErrors () {
		        const errors = []
		        if (!this.$v.timeline.description.$dirty) return errors
		        !this.$v.timeline.description.required && errors.push('Description is required.')
		        return errors
	      	},
	      	activityErrors () {
		        const errors = []
		        if (!this.$v.timeline.activity.$dirty) return errors
		        !this.$v.timeline.activity.required && errors.push('Activity is required.')
		        return errors
	      	},
	      	dateErrors () {
		        const errors = []
		        if (!this.$v.timeline.date.$dirty) return errors
				!this.$v.timeline.date.required && errors.push('Date is required.')
				this.$v.timeline.date.required && !this.$v.timeline.date.isDateValid && errors.push('Date format (DD/MM/YYYY) required.')
		        return errors
	      	},
	      	titleErrors () {
		        const errors = []
		        if (!this.$v.press.title.$dirty) return errors
		        !this.$v.press.title.required && errors.push('Title is required.')
		        return errors
	      	},
	      	urlErrors () {
		        const errors = []
		        if (!this.$v.press.url.$dirty) return errors
		        !this.$v.press.url.required && errors.push('Url is required.')
		        return errors
	      	},
	      	datePressErrors () {
		        const errors = []
		        if (!this.$v.press.date.$dirty) return errors
				!this.$v.press.date.required && errors.push('Date is required.')
				this.$v.press.date.required && !this.$v.press.date.isDateValid && errors.push('Date format (DD/MM/YYYY) required.')
		        return errors
	      	}
	    },	    
	    validations:{
	        timeline:{
	            description:{
	                required
	            },
	            activity:{
	                required
	            },
	            date:{
					required,
					isDateValid(date){return moment(date, 'DD/MM/YYYY').isValid();}
	            }
	        },
            press: {
                date:{required, isDateValid(date){return moment(date, 'DD/MM/YYYY').isValid();}},
                url:{required},
                title:{required}
            }
	    },
		created () {
			this.$emit("nav-show", true, "Timeline");			
		},
		methods: {
		   	createTimeline: function () {
            
	            var self = this;
	            self.$v.timeline.$touch();
	            
	            if(!self.$v.timeline.$invalid) {
	                this.submited = true;
	                var db = window.db.ref();
	                db = db.child("timeline");
	                var timeline = this.timeline;
	                timeline.id = (timeline.description+timeline.date + Math.floor(Math.random(10)*100)).replace(/[^A-Za-z0-9]+/g,"-");
	                timeline.date = moment(timeline.date, "DD/MM/YYYY")._i;
	                db.push(timeline);
	                self.postSuccess = true;
	                self.reset();
	            }

	            setTimeout(function() {
	            	self.postSuccess = false;
	            },2000);
	        },
	        createPress: function () {
	        	var self = this;
				self.$v.press.$touch();
	        	if(!self.$v.press.$invalid) {
	                var db = window.db.ref();
	                db = db.child("press");
	                var press = this.press;
	                press.id = (press.title+press.date + Math.floor(Math.random(10)*100)).replace(/[^A-Za-z0-9]+/g,"-");
	                press.date = moment(press.date, "DD/MM/YYYY")._i;
	                db.push(press);
	                self.postpressSuccess = true;
	                self.resetPress();
	            }
	            setTimeout(function() {
	            	self.postpressSuccess = false;
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
				this.timeline.id= "";
				this.timeline.date= "";
				this.timeline.description= "";
				this.timeline.activity= "";
				this.timeline.status = true;				
				this.$v.$reset();
		            
        	},
        	resetPress: function() {
        		
        		this.press.id = "";
	            this.press.date = "";
	            this.press.url = "";
				this.press.title = "";
				this.press.status  = true;				
				this.$v.press.$reset();
        	}
		}
	}
</script>
<style>

</style>