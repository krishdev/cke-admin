<template>
	<v-container grid-list-xl>
   		<v-layout  row wrap align-center justify-center>
   			<v-flex xs12 sm8 md4>
				<v-card class="elevation-12">
				  <v-toolbar dark color="primary">
				    <v-toolbar-title>Login form</v-toolbar-title>
				    <v-spacer></v-spacer>
				    
				  </v-toolbar>
				  <v-card-text>
				    <v-form>
				      <v-text-field prepend-icon="person" 
				      v-model="form.email" 
				      name="login" 
				      label="Login" 
				      :error-messages="emailErrors"
				      type="text"></v-text-field>
				      <v-text-field id="password" 
				      prepend-icon="lock" 
				      v-model="form.password" 
				      name="password" 
				      label="Password" 
				      :error-messages="passwordErrors"
				      type="password"></v-text-field>
				    </v-form>
				  </v-card-text>
				  <v-card-actions>
				    <v-spacer></v-spacer>
				    <v-btn color="primary" @click='login'>Login</v-btn>
				  </v-card-actions>
				</v-card>
			</v-flex>	
   		</v-layout>
   	</v-container>
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, minLength, email } from 'vuelidate/lib/validators'
  export default {
  	name:"Login",
    mixins: [validationMixin],
    data: () => ({
      drawer: null,
      form:{
      	email: "",
      	password:""
      }
		}),
    props: {
      source: String
    },
    computed: {
			passwordErrors () {
						const errors = []
						if (!this.$v.form.password.$dirty) return errors	  
						!this.$v.form.password.required && errors.push('Name is required.')
						return errors
			},
			emailErrors () {
				const errors = []
					if (!this.$v.form.email.$dirty) return errors
					!this.$v.form.email.email && errors.push('Must be valid e-mail')
					!this.$v.form.email.required && errors.push('E-mail is required')
					return errors
			}
    },
    validations:{
        form:{
            email:{
                required,
                email
            },
            password:{
                required
            }
        }
    },
    created: function(){
			this.$emit("nav-show",false,"Login");
			let $mainContent = document.querySelector("main.content");
			if($mainContent) $mainContent.classList.add("removePadding");
    },
    methods:{
    	login: function(argument) {
    		var self = this;
    		self.$v.$touch();
    		if(!self.$v.form.$invalid){
    			window.fb.signInWithEmailAndPassword(self.form.email, self.form.password)
                .then(function(result) {
                    self.user = result.user;
                    if(result.user.emailVerified || self.user){
												let $mainContent = document.querySelector("main.content");
												if($mainContent) $mainContent.classList.remove("removePadding");
                        self.$router.push("/");
                        this.$parent.$emit("nav_show",true);
                    }else{
                        
                    }                    
                })
                .catch(function(error) {
                    self.loginStatus = true;
                    self.loginStatus = true;
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    //console.log(errorMessage);
                });
    		}
    	}
    }
  }
</script>
<style>
	.content.removePadding {
		padding: 0!important;
	}
</style>