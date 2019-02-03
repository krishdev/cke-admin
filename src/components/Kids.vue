<template>
	<v-content class="removePadding" grid-list-xl>
	    <v-layout row wrap>
      		<v-flex xs12>
		        <v-list subheader>
		          <v-list-tile v-for="kid in read" :key="kid.name" class="member-container" avatar @click="">
		            <v-list-tile-avatar color="blue">
		              <img v-if="kid.photo !== ''" :src="kid.photo">            
		              <span v-if="kid.photo === ''" class="white--text headline">{{kid.name[0]}}</span>
		            </v-list-tile-avatar>
		            <v-list-tile-content>
		              <v-list-tile-title v-text="kid.name"></v-list-tile-title>
		              <v-list-tile-sub-title v-text="kid.age"></v-list-tile-sub-title>
		              <v-list-tile-sub-title class="contact" v-text="kid.villageName"></v-list-tile-sub-title>
		            </v-list-tile-content>
		            <v-list-tile-action>
		              <v-tooltip bottom>
		                <v-btn slot="activator" icon @click.stop="openInfo(kid)" ripple>
		                  <v-icon color="grey lighten-1">info</v-icon>
		                </v-btn>
		                <span>Info</span>
		              </v-tooltip>
		            </v-list-tile-action>
		            <v-list-tile-action>
		              <v-tooltip bottom>
		                <v-btn slot="activator" @click.stop="editMember(kid)" icon ripple>
		                  <v-icon color="grey lighten-1">edit</v-icon>
		                </v-btn>
		                <span>Edit</span>
		              </v-tooltip>
		            </v-list-tile-action>            
		          </v-list-tile>
		        </v-list>
      		</v-flex>
      		<v-btn
		        fab
		        bottom
		        right
		        color="pink"
		        dark
		        fixed
		        @click.stop="createDialog = !createDialog">
	        	<v-icon>add</v-icon>
	      	</v-btn>
	  	</v-layout>
	  	<v-dialog v-model="editDialog" width="800px">
	        <v-card>
			    <v-card-title
			      class="grey lighten-4 py-4 title">
			      Edit Member
		      	</v-card-title>
		      	<v-container grid-list-sm class="pa-4">
			      	<v-layout row wrap>
				        <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
				        <v-text-field
				          v-model="edit.name"
				          :error-messages="nameErrors"
				          
				          label="Name"
				          required
				          @input="$v.edit.name.$touch()"
				          @blur="$v.edit.name.$touch()">                  
				        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				        <v-text-field
				          v-model="edit.parentsName"
				          :error-messages="parentsNameErrors"
				          label="Parent Name"
				          required				          
				          @input="$v.edit.parentsName.$touch()"
				          @blur="$v.edit.parentsName.$touch()">                
				        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				        <v-text-field
				          v-model="edit.villageName"
				          :error-messages="villageNameErrors"				          
				          label="Village Name"
				          required
				          @input="$v.edit.villageName.$touch()"
				          @blur="$v.edit.villageName.$touch()">                  
				        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				        <v-text-field
				          v-model="edit.address"
				          :error-messages="addressErrors"
				          label="Address"
				          required
				          @input="$v.edit.address.$touch()"
				          @blur="$v.edit.address.$touch()">                  
				        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				           	<v-menu
				           			ref="menu"
					              lazy
					              :close-on-content-click="false"
					              v-model="menu"
					              transition="v-scale-transition"
					              :return-value.sync="edit.dateRegistered"
					              offset-y>
				              	<v-text-field
					                required
					                slot="activator"
					                label="Date"
					                readonly
					                v-model="edit.dateRegistered">					                	
			                	</v-text-field>
						        <v-date-picker
	                       			no-title
						          v-model="picker"
						          :date-format="date => new Date(date).toDateString()"
						          :formatted-value.sync="picker">
						          <v-spacer></v-spacer>
						          <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
						          <v-btn flat color="primary" @click="$refs.menu.save(edit.dateRegistered)">OK</v-btn>
						      </v-date-picker>
					    	</v-menu>
				        </v-flex>
				        <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">                  
				        <v-text-field 
				        label="Select Image" 
				        @click='pickFile' 
				        @focus="pickFile" 
				        v-model='edit.photo' 
				        :error-messages="photoErrors"
				        prepend-icon='attach_file'></v-text-field>
				        <input
				          type="file"
				          style="display: none"
				          ref="image"
				          accept="image/*"
				          @change="filesChange($event.target.name, $event.target.files)">
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				        <v-text-field
				          v-model="edit.additionalInfo"                  
				          label="Additional Info"
				          :error-messages="additionalInfoErrors">                
				        </v-text-field>
				        </v-flex>
				        <v-flex v-if="isEditLoading" xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
				        <v-progress-linear :indeterminate="true"></v-progress-linear>
				        </v-flex>              
				        <v-flex v-if="editSuccess" xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
				        <v-alert :value="true" type="info">
				          Member has been edited successfully.
				        </v-alert>
				        </v-flex>
			      	</v-layout>
	  			</v-container>
		      	<v-card-actions>
							<v-flex xs12>            
								<v-alert :value="true" v-if="editTSuccess" type="success">
										Successfully updated.
								</v-alert> 
							</v-flex
		      		<v-spacer></v-spacer>
		      		<v-btn flat @click="editDialog = false">Cancel</v-btn>
		      		<v-btn flat color="primary" @click="update(edit)">Update</v-btn>
		      	</v-card-actions>
	        </v-card>
	  	</v-dialog>
	  	<v-dialog v-model="createDialog" width="800px">
	        <v-card>
			    <v-card-title
			      class="grey lighten-4 py-4 title">
			      Add a kid
		      	</v-card-title>
		      	<v-container grid-list-sm class="pa-4">
			      	<v-layout row wrap>
				        <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
				        <v-text-field
				          v-model="create.name"
				          :error-messages="createnameErrors"
				          
				          label="Name"
				          required
				          @input="$v.create.name.$touch()"
				          @blur="$v.create.name.$touch()">                  
				        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				        <v-text-field
				          v-model="create.parentsName"
				          :error-messages="createparentsNameErrors"
				          label="Parent Name"
				          required				          
				          @input="$v.create.parentsName.$touch()"
				          @blur="$v.create.parentsName.$touch()">                
				        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				        <v-text-field
				          v-model="create.villageName"
				          :error-messages="createvillageNameErrors"				          
				          label="Village Name"
				          required
				          @input="$v.create.villageName.$touch()"
				          @blur="$v.create.villageName.$touch()">                  
				        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				        <v-text-field
				          v-model="create.address"
				          :error-messages="createaddressErrors"
				          label="Address"
				          required
				          @input="$v.create.address.$touch()"
				          @blur="$v.create.address.$touch()">                  
				        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				           	<v-menu
				           			ref="cmenu"
					              lazy
					              :close-on-content-click="false"
					              v-model="cmenu"
					              transition="v-scale-transition"
					              :return-value.sync="create.dateRegistered"
					              offset-y>
				              	<v-text-field
					                required
					                slot="activator"
					                label="Date"
					                readonly
					                v-model="create.dateRegistered">					                	
			                	</v-text-field>
						        <v-date-picker
	                       			no-title
						          v-model="cpicker"
						          :date-format="date => new Date(date).toDateString()"
						          :formatted-value.sync="picker">
						          <v-spacer></v-spacer>
						          <v-btn flat color="primary" @click="cmenu = false">Cancel</v-btn>
						          <v-btn flat color="primary" @click="addDate">OK</v-btn>
						      </v-date-picker>
					    	</v-menu>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center">                  
					        <v-text-field 
					        label="Select Image" 
					        @click='pickFile' 
					        @focus="pickFile" 
					        v-model='create.photo' 
					        :error-messages="createphotoErrors"
					        prepend-icon='attach_file'></v-text-field>
					        <input
					          type="file"
					          style="display: none"
					          ref="image"
					          accept="image/*"
					          @change="filesChange($event.target.name, $event.target.files, 'create')">
				        </v-flex>
				         <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center">                  
					        <v-text-field
					          v-model="create.age"
					          :error-messages="createageErrors"
					          label="Age"
					          required
					          @input="$v.create.age.$touch()"
					          @blur="$v.create.age.$touch()">                  
					        </v-text-field>
				        </v-flex>
				        <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
				        <v-text-field
				          v-model="create.additionalInfo"                  
				          label="Additional Info"
				          :error-messages="createadditionalInfoErrors">                
				        </v-text-field>
				        </v-flex>
				        <v-flex v-if="isCreateLoading" xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
				        <v-progress-linear :indeterminate="true"></v-progress-linear>
				        </v-flex>              
				        <v-flex v-if="createSuccess" xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
				        <v-alert :value="true" type="info">
				          Member has been added successfully.
				        </v-alert>
				        </v-flex>
			      	</v-layout>
	  			</v-container>
		      	<v-card-actions>
							<v-flex xs12>            
								<v-alert :value="true" v-if="createTSuccess" type="success">
										Successfully added.
								</v-alert> 
							</v-flex
		      		<v-spacer></v-spacer>
		      		<v-btn flat @click="createDialog = false">Cancel</v-btn>
		      		<v-btn flat color="primary" @click="createData(create)">Create</v-btn>
		      	</v-card-actions>
	        </v-card>
	  	</v-dialog>
		<v-dialog v-model="infoDigalog" width="800px">
	        <v-card>
	          <v-card-title
	            class="grey lighten-4 py-4 title">
	            Info
	          </v-card-title>
	          <v-container grid-list-sm class="pa-4">
	            <v-layout row wrap>
	              <v-flex xs12 align-center justify-space-between>
	                <v-layout align-center>
	                  <v-avatar size="80px" class="mr-3" color="blue">
	                    <img
	                      v-if="infoKid.photo !== ''"
	                      :src="infoKid.photo"
	                      alt="">
	                      <span v-if="infoKid.photo === ''" class="white--text headline">{{infoKid.name[0]}}</span>
	                  </v-avatar>                                            
	                  <v-card-title primary-title>
	                    <div>
	                      <h3 class="headline mb-0">{{infoKid.name}}</h3>
	                      <div style="text-align:left">{{infoKid.villageName}}</div>
	                    </div>
	                  </v-card-title>
	                </v-layout>
	              </v-flex>
	              <v-flex xs6>
	                <v-list-tile>
	                  <v-list-tile-action>
	                    <b>Address: </b>
	                  </v-list-tile-action>
	                  <v-list-tile-content>
	                    <v-list-tile-title>{{ infoKid.address }}</v-list-tile-title>
	                  </v-list-tile-content>
	                </v-list-tile>
	              </v-flex>
								<v-flex xs6>
	                <v-list-tile>
	                  <v-list-tile-action>
	                    <b>Age: </b>
	                  </v-list-tile-action>
	                  <v-list-tile-content>
	                    <v-list-tile-title>{{ infoKid.age }}</v-list-tile-title>
	                  </v-list-tile-content>
	                </v-list-tile>
	              </v-flex>
								<v-flex xs6>
	                <v-list-tile>
	                  <v-list-tile-action>
	                    <b>Date Registered: </b>
	                  </v-list-tile-action>
	                  <v-list-tile-content>
	                    <v-list-tile-title>{{ infoKid.dateRegistered }}</v-list-tile-title>
	                  </v-list-tile-content>
	                </v-list-tile>
	              </v-flex>
								<v-flex xs6>
	                <v-list-tile>
	                  <v-list-tile-action>
	                    <b>Parents Name: </b>
	                  </v-list-tile-action>
	                  <v-list-tile-content>
	                    <v-list-tile-title>{{ infoKid.parentsName }}</v-list-tile-title>
	                  </v-list-tile-content>
	                </v-list-tile>
	              </v-flex>
								<v-flex xs6>
	                <v-list-tile>
	                  <div>
	                    <b>Additional Info: </b>
	                  </div><br>
	                  <div>
	                    <div>{{ infoKid.additionalInfo }}</div>
	                  </div>
	                </v-list-tile>
	              </v-flex>
	            </v-layout>
	          </v-container>
	          <v-card-actions>            
	            <v-spacer></v-spacer>
	            <v-btn flat color="primary" @click="infoDigalog = false">Close</v-btn>            
	          </v-card-actions>
	        </v-card>
      	</v-dialog>
	</v-content>	
</template>
<script>
	import { validationMixin } from 'vuelidate'
	import { required } from 'vuelidate/lib/validators'
	import { db,storageRef } from '../main'
	export default {
		mixins: [validationMixin],
		data: () => ({
			months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			create: {
				id: "",
				name: "",
				parentsName: "",
				villageName: "",
				address: "",
				age: "",
				dateRegistered: "",
				photo: "",				
				additionalInfo: "",
				photoName: ""
			},
			read: [],
			dialog : false,
			memory:'',
			edit: {
				id: "",
				name: "",
				parentsName: "",
				villageName: "",
				address: "",
				age: "",
				dateRegistered: "",
				photo: "",				
				additionalInfo: ""
			},
			createDialog: false,
			editDialog: false,
			infoDigalog: false,
			isEditLoading: false,
			isCreateLoading: false,
			editSuccess: false,
			createSuccess: false,
			picker:"",
			cpicker:"",
			editTSuccess: false,
			createTSuccess: false,
			menu:"",
			cmenu:"",
			infoKid: {}
		}),
		validations: {
			edit: {
				name: {
					required
				},
				parentsName: {
					required
				},
				villageName: {
					required
				},
				address: {
					required
				},
				age: {
					required
				},
				dateRegistered: {
					required
				},
				photo: {
					required
				},				
				additionalInfo: {
					required
				}
			},
			create: {
				name: {
					required
				},
				parentsName: {
					required
				},
				villageName: {
					required
				},
				address: {
					required
				},
				age: {
					required
				},
				dateRegistered: {
					required
				},
				photo: {
					required
				},				
				additionalInfo: {
					required
				}
			}
		},
		computed: {
		 	nameErrors () {
		        const errors = []
		        if (!this.$v.edit.name.$dirty) return errors
		        !this.$v.edit.name.required && errors.push('Name is required.')
		        return errors
	      	},
	      	parentsNameErrors () {
	      		const errors = []
		        if (!this.$v.edit.parentsName.$dirty) return errors
		        !this.$v.edit.parentsName.required && errors.push('Parent Name is required.')
		        return errors
	      	},
	      	villageNameErrors () {
	      		const errors = []
		        if (!this.$v.edit.villageName.$dirty) return errors
		        !this.$v.edit.villageName.required && errors.push('Village Name is required.')
		        return errors
	      	},
	      	addressErrors () {
	      		const errors = []
		        if (!this.$v.edit.address.$dirty) return errors
		        !this.$v.edit.address.required && errors.push('Address is required.')
		        return errors
	      	},
	      	ageErrors () {
	      		const errors = []
		        if (!this.$v.edit.age.$dirty) return errors
		        !this.$v.edit.age.required && errors.push('Age is required.')
		        return errors
	      	},
	      	dateRegisteredErrors () {
	      		const errors = []
		        if (!this.$v.edit.dateRegistered.$dirty) return errors
		        !this.$v.edit.dateRegistered.required && errors.push('Date Registered is required.')
		        return errors
	      	},
	      	photoErrors () {
	      		const errors = []
		        if (!this.$v.edit.photo.$dirty) return errors
		        !this.$v.edit.photo.required && errors.push('Photo is required.')
		        return errors
	      	},
	      	additionalInfoErrors () {
	      		const errors = []
		        if (!this.$v.edit.additionalInfo.$dirty) return errors
		        !this.$v.edit.additionalInfo.required && errors.push('Additional Info is required.')
		        return errors
	      	},
	      	formatedDate () {
	      		var formatedDate ;
				var self = this;
				var picker = new Date(this.edit.dateRegistered),
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
	      	},
	      	createnameErrors () {
				const errors = []
				if (!this.$v.create.name.$dirty) return errors
				!this.$v.create.name.required && errors.push('Name is required.')
				return errors
			},
			createparentsNameErrors () {
				const errors = []
				if (!this.$v.create.parentsName.$dirty) return errors
				!this.$v.create.parentsName.required && errors.push('Parent Name is required.')
				return errors
			},
			createvillageNameErrors () {
				const errors = []
				if (!this.$v.create.villageName.$dirty) return errors
				!this.$v.create.villageName.required && errors.push('Village Name is required.')
				return errors
			},
			createaddressErrors () {
				const errors = []
				if (!this.$v.create.address.$dirty) return errors
				!this.$v.create.address.required && errors.push('Address is required.')
				return errors
			},
			createageErrors () {
				const errors = []
				if (!this.$v.create.age.$dirty) return errors
				!this.$v.create.age.required && errors.push('Age is required.')
				return errors
			},
			createdateRegisteredErrors () {
				const errors = []
				if (!this.$v.create.dateRegistered.$dirty) return errors
				!this.$v.create.dateRegistered.required && errors.push('Date Registered is required.')
				return errors
			},
			createphotoErrors () {
				const errors = []
				if (!this.$v.create.photo.$dirty) return errors
				!this.$v.create.photo.required && errors.push('Photo is required.')
				return errors
			},
			createadditionalInfoErrors () {
				const errors = []
				if (!this.$v.create.additionalInfo.$dirty) return errors
				!this.$v.create.additionalInfo.required && errors.push('Additional Info is required.')
				return errors
			},
			createformatedDate () {
				var formatedDate ;
				var self = this;
				var picker = new Date(this.create.dateRegistered),
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
	  watch:{
		    "picker":function(newDate){
		      var thisDate = new Date(newDate)
		      this.ed = thisDate.getTime();
		    }
	  },
		created() {
			
			this.$emit("nav-show",true,"Admin",false);
			var self = this;
			var ref = db.ref();
			var thisMember = {};
			ref.child("kids").on("child_added", function(response) {              
				thisMember = response.val();
				self.read.push(thisMember);        
			})

		},
		methods: {
			"openInfo": function (info) {
				this.infoKid = info;
				this.infoDigalog = true;
			},
			"editMember" : function (editedItem) {
				
				this.editDialog = true;
				this.edit = editedItem;				
			},
			"update" : function(editedItem) {
				var dbRef = db.ref("kids");
				var key;
				var self = this;
				this.$v.edit.$touch();
				this.editSuccess = false;
				var timeline = editedItem;
				if(!this.$v.edit.$invalid) {
					this.isEditLoading = true;					
					dbRef.orderByChild("id").equalTo(timeline.id).on("child_added", function(snapshot) {          
						
						key = snapshot.key;
						var update = {};
						update[key] = {
							"additionalInfo" : timeline.additionalInfo,
							"address" : timeline.address,
							"age" : timeline.age,
							"dateRegistered" : timeline.dateRegistered,
							"id" : timeline.id,
							"name" : timeline.name,
							"parentsName" : timeline.parentsName,
							"photo" : timeline.photo,
							"villageName" : timeline.villageName
						};
						db.ref("kids").update(update, function(response){
							
							self.editTSuccess = true;                      
							setTimeout(function() {
								self.editDialog = false;
								self.editTSuccess = false;
								self.dialog = false;
								self.isEditLoading = false;
							},2000);
						});          
					});
				}
			},
			pickFile () {
				this.$refs.image.click ()
			},
			filesChange: function(name, file, type) {
				
				if (file && type == "create") {
					this.create.photo = file[0];
					this.create.photoName = file[0].name;
				} else if(file){
					this.edit.photo = file;
				}
			},
			editDate: function (date) {
				//console.log(date);
				this.edit.dateRegistered = date;

			},
			addDate: function () {
				
				this.$refs.cmenu.save(this.cpicker);
			},
			getRandomInt(min, max) {
		        min = Math.ceil(min);
		        max = Math.floor(max);
		        return Math.floor(Math.random() * (max - min)) + min; 
		        //The maximum is exclusive and the minimum is inclusive
	      	},
			createData: function (editedItem) {
				var dbRef = window.db.ref("kids");
				var trimName = this.create.name.replace(/[^a-z0-9]/gi, '');
        		trimName = trimName + this.getRandomInt(0, 9);
				var userRef = window.storageRef.child(trimName + '.jpg');
				var key;
				var self = this;
				this.$v.create.$touch();
				this.createSuccess = false;
				var kidItem = editedItem;
				if(!this.$v.create.$invalid) {
					this.isCreateLoading = true;	
					var db = window.db.ref();
					db = db.child("kids");
					userRef.put(this.create.photo).then(function(snapshot) {
              
		              if(snapshot.state == "success" && !snapshot.downloadURL) {
		                self.create.photo = "https://firebasestorage.googleapis.com/v0/b/chotukiedu.appspot.com/o/" + snapshot.metadata.name + "?alt=media&token=";
		              } else if(snapshot.downloadURL !== "") {
		                  self.create.photo = snapshot.downloadURL;
		              }

		              kidItem.id = (kidItem.name+kidItem.dateRegistered+
	Math.floor(Math.random(10)*100)).replace(/[^A-Za-z0-9]+/g,"-");
					kidItem.dateRegistered = (new Date()).getTime();
					db.push(kidItem);
												
					self.createTSuccess = true;                      
					setTimeout(function() {
						self.createDialog = false;
						self.createTSuccess = false;
						self.createdialog = false;
						self.isCreateLoading = false;
						self.resetCreate();
					},2000);

		          	});
					
				}
			}, 
			resetCreate: function() {
				this.create = {
					id: "",
					name: "",
					parentsName: "",
					villageName: "",
					address: "",
					age: "",
					dateRegistered: "",
					photo: "",				
					additionalInfo: "",
					photoName: ""
				}
				this.$v.create.$reset();
			}
		}
	};
</script>
<style scoped>
	.removePadding {
    	padding: 0 !important;
	}
</style>