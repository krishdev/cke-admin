<template>
  <v-content class="removePadding" grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-list subheader>
          <v-subheader>Active Members</v-subheader>
          <v-progress-circular v-if="!activeMembers" :size="70" :width="7" indeterminate color="purple"></v-progress-circular>
          <v-subheader v-if="activeMembers.length == 0">No Active Members</v-subheader>
          <v-list-tile v-for="member in activeMembers" :key="member.name" class="member-container" avatar @click="">
            <v-list-tile-avatar color="blue">
              <img v-if="member.photo !== ''" :src="member.photo">            
              <span v-if="member.photo === ''" class="white--text headline">{{member.name[0]}}</span>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="member.name"></v-list-tile-title>
              <v-list-tile-sub-title v-text="member.city"></v-list-tile-sub-title>
              <v-list-tile-sub-title class="contact" v-text="member.phone"></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-tooltip bottom>
                <v-btn slot="activator" icon @click.stop="openInfo(member)" ripple>
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
                <span>Info</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-tooltip bottom>
                <v-btn slot="activator" @click.stop="editMember(member)" icon ripple>
                  <v-icon color="grey lighten-1">edit</v-icon>
                </v-btn>
                <span>Edit</span>
              </v-tooltip>
            </v-list-tile-action>            
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12 md6>
        <v-list subheader>
          <v-subheader>In Active Members</v-subheader>
          <v-progress-circular v-if="!inActiveMembers" style="margin:0 25%;" :size="50" :width="7" indeterminate color="purple"></v-progress-circular>
          <v-subheader v-if="inActiveMembers.length == 0">No In Active Members</v-subheader>
          <v-list-tile v-for="member in inActiveMembers" :key="member.name" class="member-container" avatar @click="">
            <v-list-tile-avatar color="blue">
              <img v-if="member.photo !== ''" :src="member.photo">            
              <span v-if="member.photo === ''" class="white--text headline">{{member.name[0]}}</span>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="member.name"></v-list-tile-title>
              <v-list-tile-sub-title v-text="member.city"></v-list-tile-sub-title>
              <v-list-tile-sub-title class="contact" v-text="member.phone"></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-tooltip bottom>
                <v-btn slot="activator" icon @click.stop="openInfo(member)" ripple>
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
                <span>Info</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-tooltip bottom>
                <v-btn slot="activator" @click.stop="editMember(member)" icon ripple>
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
        @click.stop="dialog = !dialog">
        <v-icon>add</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" width="800px">
        <v-card>
          <v-card-title
            class="grey lighten-4 py-4 title">
            Add Member
          </v-card-title>
          <v-container grid-list-sm class="pa-4">
            <v-layout row wrap>
              <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                <v-text-field
                  v-model="add.name"
                  :error-messages="nameErrors"                  
                  label="Name"
                  required
                  @input="$v.add.name.$touch()"
                  @blur="$v.add.name.$touch()">                  
                </v-text-field>
              </v-flex>
              <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
                <v-text-field
                  v-model="add.email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  required
                  @input="$v.add.email.$touch()"
                  @blur="$v.add.email.$touch()"
                  @change="verifyEmail">                
                </v-text-field>
              </v-flex>
              <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
                <v-text-field
                  v-model="add.phone"
                  :error-messages="phoneErrors"
                  
                  label="Phone"
                  required
                  @input="$v.add.phone.$touch()"
                  @blur="$v.add.phone.$touch()">                  
                </v-text-field>
              </v-flex>
              <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
                <v-text-field
                  v-model="add.city"
                  :error-messages="cityErrors"
                  label="City"
                  required
                  @input="$v.add.city.$touch()"
                  @blur="$v.add.city.$touch()">                  
                </v-text-field>
              </v-flex>
              <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
                <v-select
                  :items="['Active','InActive']"
                  v-model="add.status"
                  :error-messages="statusErrors"
                  label="Status"
                  item-value="text"
                ></v-select>
              </v-flex>
              <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">                  
                <v-text-field label="Select Image" @click='pickFile' @focus="pickFile" v-model='add.photo' prepend-icon='attach_file'></v-text-field>
                <input
                  type="file"
                  style="display: none"
                  ref="image"
                  accept="image/*"
                  @change="filesChange($event.target.name, $event.target.files)"
                >
              </v-flex>
              <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
                <v-text-field
                  v-model="add.occupation"                  
                  label="Occupation">                
                </v-text-field>
              </v-flex>
              <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
                <v-text-field
                  v-model="add.degree"
                  label="Degree"
                  >                  
                </v-text-field>
              </v-flex>
              <v-flex v-if="isAddLoading" xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                <v-progress-linear :indeterminate="true"></v-progress-linear>
              </v-flex>              
              <v-flex v-if="addSuccess" xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                <v-alert :value="true" type="info">
                  Member has been added successfully.
                </v-alert>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="cancel">Cancel</v-btn>
            <v-btn flat color="primary" @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
              :error-messages="nameEditErrors"
              
              label="Name"
              required
              @input="$v.edit.name.$touch()"
              @blur="$v.edit.name.$touch()">                  
            </v-text-field>
            </v-flex>
            <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
            <v-text-field
              v-model="edit.email"
              :error-messages="emailEditErrors"
              label="E-mail"
              required
              disabled
              @input="$v.edit.email.$touch()"
              @blur="$v.edit.email.$touch()"
              @change="verifyEmail">                
            </v-text-field>
            </v-flex>
            <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
            <v-text-field
              v-model="edit.phone"
              :error-messages="phoneEditErrors"
              
              label="Phone"
              required
              @input="$v.edit.phone.$touch()"
              @blur="$v.edit.phone.$touch()">                  
            </v-text-field>
            </v-flex>
            <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
            <v-text-field
              v-model="edit.city"
              :error-messages="cityEditErrors"
              label="City"
              required
              @input="$v.edit.city.$touch()"
              @blur="$v.edit.city.$touch()">                  
            </v-text-field>
            </v-flex>
            <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
              <v-select
                :items="['Active','InActive']"
                v-model="edit.status"
                :error-messages="statusEditErrors"
                label="Status"
                item-value="text"
              ></v-select>
            </v-flex>
            <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">                  
            <v-text-field label="Select Image" @click='pickFile' @focus="pickFile" v-model='edit.photo' prepend-icon='attach_file'></v-text-field>
            <input
              type="file"
              style="display: none"
              ref="image"
              accept="image/*"
              @change="filesChange($event.target.name, $event.target.files)"
            >
            </v-flex>
            <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
            <v-text-field
              v-model="edit.occupation"                  
              label="Occupation">                
            </v-text-field>
            </v-flex>
            <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center"> 
            <v-text-field
              v-model="edit.degree"
              label="Degree"
              >                  
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
          <v-spacer></v-spacer>
          <v-btn flat @click="editDialog = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="update(edit)">Update</v-btn>
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
                      v-if="memberInfo.photo !== ''"
                      :src="memberInfo.photo"
                      alt="">
                      <span v-if="memberInfo.photo === ''" class="white--text headline">{{memberInfo.name[0]}}</span>
                  </v-avatar>                                            
                  <v-card-title primary-title>
                    <div>
                      <h3 class="headline mb-0">{{memberInfo.name}}, {{memberInfo.degree}}</h3>
                      <div style="text-align:left">{{memberInfo.occupation}}</div>
                    </div>
                  </v-card-title>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon>home</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ memberInfo.city }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
              <v-flex xs12>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon>email</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title><a :href="'mailto:'+memberInfo.email">{{ memberInfo.email }}</a></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
              <v-flex xs12>
                 <v-list-tile>
                  <v-list-tile-action>
                    <v-icon>phone</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title><a :href="'tel:'+memberInfo.phone">{{ memberInfo.phone }}</a></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
               <v-flex xs12>
                 <v-list-tile>
                  <v-list-tile-action>
                    <v-icon>stars</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ memberInfo.howYouHear }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
              <v-flex xs12>
                 <v-list-tile>
                  <v-list-tile-action>
                    <v-icon>comment</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <p>{{ memberInfo.review }}</p>
                  </v-list-tile-content>
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

    </v-layout>
  </v-content>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  import { db,storageRef } from '../main'
  export default {
    name:"Admin",
    mixins: [validationMixin],
    data: () => ({
      members:[],
      memberInfo:{

      },
      add: {
        "city": "",
        "degree": "",
        "email": "",
        "howYouHear": "",
        "name": "",
        "occupation": "",
        "phone": "",
        "photo": "",
        "review": "",
        "date": "",
        "status":""
      },
      edit: {
        "city": "",
        "degree": "",
        "email": "",
        "howYouHear": "",
        "name": "",
        "occupation": "",
        "phone": "",
        "photo": "",
        "review": "",
        "date": "",
        "status":""
      },
      name: '',
      email: '',
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      isAddLoading:false,
      isEditLoading:false,
      checkbox: null,
      dictionary: {
        attributes: {
          email: 'E-mail Address'
          // custom attributes
        },
        custom: {
          name: {
            required: () => 'Name can not be empty',
            max: 'The name field may not be greater than 10 characters'
            // custom messages
          },
          select: {
            required: 'Select field is required'
          }
        }
      },
      dialog:false,
      infoDigalog:false,
      editDialog: false,
      addSuccess: false,
      editSuccess: false,
      userExist: false
    }),
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.add.name.$dirty) return errors
        !this.$v.add.name.required && errors.push('Name is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.add.email.$dirty) return errors
        !this.$v.add.email.email && errors.push('Must be valid e-mail')
        !this.$v.add.email.required && errors.push('E-mail is required')
        return errors
      },
      phoneErrors () {
        const errors = []
        if (!this.$v.add.phone.$dirty) return errors
        !this.$v.add.phone.required && errors.push('Phone is required.')
        return errors
      },
      cityErrors () {
        const errors = []
        if (!this.$v.add.city.$dirty) return errors
        !this.$v.add.city.required && errors.push('City is required.')
        return errors
      },
      statusErrors () {
        const errors = []
        if (!this.$v.add.status.$dirty) return errors
        !this.$v.add.status.required && errors.push('Status is required.')
        return errors
      },
      nameEditErrors () {
        const errors = []
        if (!this.$v.edit.name.$dirty) return errors
        !this.$v.edit.name.required && errors.push('Name is required.')
        return errors
      },
      emailEditErrors () {
        const errors = []
        if (!this.$v.edit.email.$dirty) return errors
        !this.$v.edit.email.email && errors.push('Must be valid e-mail')
        !this.$v.edit.email.required && errors.push('E-mail is required')
        return errors
      },
      phoneEditErrors () {
        const errors = []
        if (!this.$v.edit.phone.$dirty) return errors
        !this.$v.edit.phone.required && errors.push('Phone is required.')
        return errors
      },
      cityEditErrors () {
        const errors = []
        if (!this.$v.edit.city.$dirty) return errors
        !this.$v.edit.city.required && errors.push('City is required.')
        return errors
      },
      statusEditErrors () {
        const errors = []
        if (!this.$v.edit.status.$dirty) return errors
        !this.$v.edit.status.required && errors.push('Status is required.')
        return errors
      },
      activeMembers() {
        return this.members.filter(function(item,index) {
          return item.status == "Active";
        });
      },
      inActiveMembers() {
        return this.members.filter(function(item,index) {
          return item.status == "InActive";
        });
      }
    },
    validations:{
      add:{
        name: { required },
        email: { required, email },
        phone: {required},
        city:{required},
        status:{required}
      },
      edit:{
        name: { required },
        email: { required, email },
        phone: {required},
        city:{required},
        status:{required}
      }
    },
    props: {
      source: String
    },
    created:function () {
      this.$emit("nav-show",true,"Admin",false);
      var self = this;
      var ref = db.ref();
      var thisMember = {};
      ref.child("members").on("child_added", function(response) {              
        thisMember = response.val();
        self.members.push(thisMember);        
      }) 
    },
    methods: {
      submit () {

      },
      filesChange: function(name, file) {
        
        if (file) {
          this.add.photo = file;
        }
      },
      pickFile () {
        this.$refs.image.click ()
      },
      save() {
        
        this.$v.add.$touch();
        var file = this.add.photo[0]; 
        var trimName = this.add.name.replace(/[^a-z0-9]/gi, '');
        trimName = trimName + this.getRandomInt(0, 9);
        var userRef = storageRef.child(trimName + '.jpg');
        var downLoadUrl;
        var dbr = db.ref();
        dbr = dbr.child("members");
        var self = this;
        var date = new Date();
        self.add.date = date.toISOString();        
        if (!this.userExist && !this.$v.add.$invalid) {
          self.isAddLoading = true;
          this.error = false;
          if (self.add.photo) {            
            userRef.put(file).then(function(snapshot) {
              
              if(snapshot.state == "success" && !snapshot.downloadURL) {
                self.add.photo = "https://firebasestorage.googleapis.com/v0/b/chotukiedu.appspot.com/o/" + snapshot.metadata.name + "?alt=media&token=";
              } else if(snapshot.downloadURL !== "") {
                  self.add.photo = snapshot.downloadURL;
              }
              dbr.push(self.add);
              self.isAddLoading = false;
              self.addSuccess = true;          
              self.resetForm();
              setTimeout(function(){
                self.addSuccess = false;
              },3000);
            });
          } else {
            dbr.push(self.add);
          }                  
        }
      },
      cancel() {
        this.resetForm();
        this.dialog = false;
      },
      editMember(member) {
        this.edit = member;        
        this.editDialog = true;
      },
      update(member) {
        
        var dbRef = db.ref("members");
        var key;
        var self = this;        
        var member = member;
        if(!this.$v.edit.$invalid) {
          dbRef.orderByChild("email").equalTo(member.email).on("child_added", function(snapshot) {          
            
            self.isEditLoading = true;
            key = snapshot.key;
            var update = {};
            update[key] = {
              "city" : member.city,
              "degree" : member.degree,
              "email" : member.email,
              "howYouHear" : member.howYouHear,
              "name" : member.name,
              "occupation" : member.occupation,
              "phone" : member.phone,
              "photo" : member.photo,
              "review" : member.review,
              "status": member.status
            };
            db.ref("members").update(update, function(response){
              
              self.isEditLoading = false;          
              self.editSuccess = true;                      
              setTimeout(function(){
                self.editSuccess = false;
                self.editDialog = false;
              },2000);
            });          
          });   
        }                  
      },
      resetForm() {
        for(var i in this.add) {
          this.add[i] = "";
        }
        this.$v.add.name.$reset();
        this.$v.add.email.$reset();
        this.$v.add.phone.$reset();
        this.$v.add.city.$reset();
      },
      clear () {
        this.name = ''
        this.email = ''
        this.select = null
        this.checkbox = null
      },
      openInfo: function(member) {
        this.memberInfo = member;
        this.infoDigalog = true;
      },
      getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
      },
      verifyEmail: function() {
        
        var self = this;
        self.userExist = false;
        db.ref("members").orderByChild("email").equalTo(this.add.email).on("child_added", function(snapshot) {
          
          if (snapshot.key) {
            self.userExist = true;
          }
        });
      }
    }
  }
</script>
<style scoped>
  .member-container{
    margin-bottom: 1em;
  }
  .member-container:last-child{
    margin-bottom: 0em;
  }  
  .removePadding {
    padding: 0 !important;
  }
</style>