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
									<v-text-field v-model="editedTimeline.description" 
										:error-messages="descriptionErrors"                  
														label="Description"
														required
														@input="$v.editedTimeline.description.$touch()"
														@blur="$v.editedTimeline.description.$touch()">  
									></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-select
														:items="['Bookish','Sports','General', 'Culturals']"
														v-model="editedTimeline.activity"
														:error-messages="activityErrors"
														label="Activity"
														item-value="text"
													></v-select>
								</v-flex>
								<v-flex xs12>
									<v-text-field
										v-model="editedTimeline.date"
										:error-messages="dateErrors"                  
										label="Date (dd/mm/yyyy)"
										required
										@input="$v.editedTimeline.date.$touch()"
										@blur="$v.editedTimeline.date.$touch()">                  
									</v-text-field>
								</v-flex>
			        </v-layout>
		      	</v-container>
		    </v-card-text>
		    <v-card-actions>
		      <v-flex xs12>            
		        <v-alert :value="true" v-if="editTSuccess" type="success">
		            The Timeline has been successfully updated.
		        </v-alert> 
		      </v-flex>
		      <v-spacer></v-spacer>
		      <v-btn color="blue darken-1" flat @click.native="dialog = !dialog">Cancel</v-btn>
		      <v-btn color="blue darken-1" flat @click.native="updateTimeline(editedTimeline)">Save</v-btn>
		    </v-card-actions>
		  </v-card>
		</v-dialog>	

		<v-dialog v-model="dialogPress" max-width="900px">
	  		<v-card>
			    <v-card-title>
			      <span class="headline">Edit Press</span>
			    </v-card-title>
			    <v-card-text>
		      		<v-container grid-list-md>
			        <v-layout wrap>
						<v-flex xs12>
			            	<v-text-field
			                  v-model="editedPress.title"
			                  :error-messages="titleErrors"                  
			                  label="Title"
			                  required
			                  @input="$v.editedPress.title.$touch()"
			                  @blur="$v.editedPress.title.$touch()">                  
			                </v-text-field>
			            </v-flex>
			            <v-flex xs12>
			            	<v-text-field
			                  v-model="editedPress.url"
			                  :error-messages="urlErrors"                  
			                  label="Url"
			                  required
			                  @input="$v.editedPress.url.$touch()"
			                  @blur="$v.editedPress.url.$touch()">                  
			                </v-text-field>
			            </v-flex>	            
			            <v-flex xs12>
										<v-text-field
											v-model="editedPress.date"
											:error-messages="datePressErrors"                  
											label="Date (dd/mm/yyyy)"
											required
											@input="$v.editedPress.date.$touch()"
											@blur="$v.editedPress.date.$touch()">                  
										</v-text-field>
			            </v-flex>
			            <v-flex xs12>
			            	<v-alert :value="true" v-if="editSuccess" type="success">
						      The timeline has been successfully created.
						    </v-alert>	
			            </v-flex>
			        </v-layout>
		      	</v-container>
		    </v-card-text>
		    <v-card-actions>
		      <v-flex xs12>            
		        <v-alert :value="true" v-if="editSuccess" type="success">
		            The Timeline has been successfully updated.
		        </v-alert> 
		      </v-flex>
		      <v-spacer></v-spacer>
		      <v-btn color="blue darken-1" flat @click.native="dialogPress = !dialogPress">Cancel</v-btn>
		      <v-btn color="blue darken-1" flat @click.native="updatePress(editedPress)">Save</v-btn>
		    </v-card-actions>
		  </v-card>
		</v-dialog>	

		<v-data-table
		  :headers="headerTimeline"
	      :items="timeline"
	      hide-actions
	      class="elevation-1 rowTable timeline">
	      <template slot="items" slot-scope="article" v-if="article.item.status">
	        <td>{{ article.item.description }}</td>
	        <td class="text-xs-right">{{ article.item.date | format}}</td>
	        <td class="justify-center layout px-0">
	          <v-btn icon class="mx-0" @click="editItem(article.item)">
	            <v-icon color="teal">edit</v-icon>
	          </v-btn>
	          <v-btn icon class="mx-0" @click="deleteTimeline(article.item)">
	            <v-icon color="pink">delete</v-icon>
	          </v-btn>
	        </td>
	      </template>
	    </v-data-table>
	    <v-divider inset></v-divider>
	    <v-data-table
	      :headers="headerPress"
	      :items="press"
	      hide-actions
	      class="elevation-1 rowTable mt-5">
	      <template slot="items" slot-scope="article" v-if="article.item.status">
	        <td><a :href="article.item.url"> {{ article.item.title }} </a></td>
	        <td class="text-xs-right">{{ article.item.date | format}}</td>
	        <td class="justify-center layout px-0">
	          <v-btn icon class="mx-0" @click="editPressItem(article.item)">
	            <v-icon color="teal">edit</v-icon>
	          </v-btn>
	          <v-btn icon class="mx-0" @click="deletePress(article.item)">
	            <v-icon color="pink">delete</v-icon>
	          </v-btn>
	        </td>
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
		mixins: [validationMixin],    
		data: () =>({
			dialog: false,
			dialogPress: false,
			timeline:[],
			press:[],
			headerPress: [
				{
					text:"Press",
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
			headerTimeline: [
				{
					text:"Timeline",
					sortable: false
				},
				{
					text:"",
					sortable: false
				},
				{
					text:" ",
					sortable: false,
					id:"d"
				}
			],
			editedTimeline:{
				id:"",
				description: "",
				activity:"",
				date:""
			},			
            editedPress: {
                id:"",
                date:"",
                url:"",
                title:""
            },
			timePicker: "",
			timePressPicker: "",
			formatted:"",
      		months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      		editSuccess: false,
      		editTSuccess: false,
      		menu: "",
      		menu2: ""
		}),
		filters: {
		    
		  format: function(date) {
		    
		    return moment(date).format("MMM DD YYYY");
		    }
		},
		created () {
			var self = this;
	      	var ref = db.ref();
	      	ref.child("timeline").orderByChild("date").on("child_added", function(response){
	      		            
	      		self.timeline.push(response.val());          
	      	}) ;
	      	ref.child("press").orderByChild("date").on("child_added", function(response){
	      		             
	      		self.press.push(response.val());          
	      	}) 
		},
		computed: {
			titleErrors () {
				const errors = []
				if (!this.$v.editedPress.title.$dirty) return errors
				!this.$v.editedPress.title.required && errors.push('Title is required.')
				return errors
			},
			urlErrors () {
				const errors = []
				if (!this.$v.editedPress.url.$dirty) return errors
				!this.$v.editedPress.url.required && errors.push('Url is required.')
				return errors
			},
			datePressErrors () {
				const errors = []
				if (!this.$v.editedPress.date.$dirty) return errors
				!this.$v.editedPress.date.required && errors.push('Date is required.')
				this.$v.editedPress.date.required && !this.$v.editedPress.date.isDateValid && errors.push('Date format (DD/MM/YYYY) required.')
				return errors
			},
			descriptionErrors () {
				const errors = []
				if (!this.$v.editedTimeline.description.$dirty) return errors
				!this.$v.editedTimeline.description.required && errors.push('Description is required.')
				return errors
			},
			activityErrors () {
				const errors = []
				if (!this.$v.editedTimeline.activity.$dirty) return errors
				!this.$v.editedTimeline.activity.required && errors.push('Activity is required.')
				return errors
			},
			dateErrors () {
				const errors = []
				if (!this.$v.editedTimeline.date.$dirty) return errors
				!this.$v.editedTimeline.date.required && errors.push('Date is required.')
				this.$v.editedTimeline.date.required && !this.$v.editedTimeline.date.isDateValid && errors.push('Date format (DD/MM/YYYY) required.')
				return errors
			},
			formatedDate () {				
				
			},
			formatedPressDate () {
				var formatedDate ;
				var self = this;
				var picker = new Date(this.editedPress.date),
				month;
			    //debugger
				if(!isNaN( picker.getTime() )){
				month = self.months[picker.getUTCMonth()]
				} else {
				picker = new Date();
				month = self.months[picker.getUTCMonth()]
				}
				formatedDate = month + " "+ picker.getUTCDate() + ", " + picker.getFullYear();
				return formatedDate; 
			}
		},
		validations:{
	        editedTimeline:{
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
	        editedPress: {
                date:{
	                required,
									isDateValid(date){return moment(date, 'DD/MM/YYYY').isValid();}
	            },
                url:{
	                required
	            },
                title:{
	                required
	            }
            }
	    },
	 	watch:{
			"timePicker":function(newDate){
				var thisDate = new Date(newDate)
				this.editedTimeline.date = thisDate.getTime();
			}
		},
		methods: {
			updateTimeline: function (editedItem, isDltd) {
				var dbRef = db.ref("timeline");
				var key;
				var self = this;      
				var timeline = editedItem;
				if(!this.$v.editedTimeline.$invalid || isDltd) {
					dbRef.orderByChild("id").equalTo(timeline.id).on("child_added", function(snapshot) {          
						
						key = snapshot.key;
						var update = {};
						update[key] = {
							"id" : timeline.id,
							"description" : timeline.description,
							"activity" : timeline.activity,
							"date": moment(timeline.date, "DD/MM/YYYY")._i,
							"status": true
						};
						db.ref("timeline").update(update, function(response){
							
							self.editTSuccess = true;                      
							setTimeout(function(){
								self.editTSuccess = false;
								self.dialog = false;
							},2000);
						});          
					});   
				}
			},
			updatePress: function (editedItem, isDltd) {
				var dbRef = db.ref("press");
		        var key;
		        var self = this;      
		        
		        var press = editedItem;
		        if(!this.$v.editedPress.$invalid || isDltd) {
		          dbRef.orderByChild("id").equalTo(press.id).on("child_added", function(snapshot) {          
		            
		            key = snapshot.key;
		            var update = {};
		            update[key] = {
		              "id" : press.id,
		              "url" : press.url,
		              "title" : press.title,
									"date": moment(press.date, "DD/MM/YYYY")._i,
									"status": true
		            };
		            db.ref("press").update(update, function(response){
		              self.editSuccess = true;                      
		              setTimeout(function(){
		                self.editSuccess = false;
		                self.dialogPress = false;
		              },2000);
		            });          
		          });   
		        }
			},
			editItem: function (editIt) {
				this.dialog = !this.dialog;
				var _this = this;
				this.editedTimeline = JSON.parse(JSON.stringify(editIt));
				_this.editedTimeline.date = moment(_this.editedTimeline.date).format("DD/MM/YYYY"); 
			},
			editPressItem: function (editIt) {
				this.dialogPress = !this.dialogPress;
				var _this = this;
				this.editedPress = JSON.parse(JSON.stringify(editIt));
				_this.editedPress.date = moment(_this.editedPress.date).format("DD/MM/YYYY"); 
			},
			deleteTimeline: function(dltItem) {
				dltItem.status = false;
				this.updateTimeline(dltItem, true);
			},
			deletePress: function(dltItem) {
				dltItem.status = false;
				this.updatePress(dltItem, true);
			},
			createPress: function (){

			},
			save: function (){

			}
		}
	}
</script>
<style>
	@import "../assets/css/styles.css"
</style>