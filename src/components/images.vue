<template>
 	<v-layout id="imgLoad" row wrap>
 		<v-flex xs12 sm6 md4
 			v-for="(image,index) in images"
 		 	v-if="image.url_z" >
 			<v-card>
				<v-card-media
					:src="image.url_z"
					height="200px">
				
				</v-card-media>    
				<v-container fill-height fluid>
				  <v-layout fill-height>
				    <v-flex bottom xs12 align-end flexbox>
			    	 	<input type="text" :value="image.url_z" 
				          :id="image.id" style="width:67%">				    	 			    	 	
					     <v-tooltip top>				          
					     	<v-btn slot="activator" fab @click="copy(image)" dark small color="primary">
						      <v-icon dark>file_copy</v-icon>
						    </v-btn>
				          	<span>Copy</span>
				        </v-tooltip>	
				      	                   
				    </v-flex>
				  </v-layout>
				</v-container>              
			</v-card>
 		</v-flex>
 		<v-flex xs12>
	        <div class="text-center" style="margin-top: 1em;">
	            <v-btn block dark color="purple" @click="loadMore">{{btnText}}</v-btn>
	        </div>
	    </v-flex>
    </v-layout>
</template>
<script>
	import { db } from '../main'
	export default{
	    name:"Images",
	    data(){
	        return{
	            images:[],
	            page:2,
	            pages:1,
	            btnText: "Load more"
	        }
	    },
	    created:function(){
	        var self = this;        
	        self.$http.get("http://krishdev.com/api/getGalleryCKE?page=1").then(function(response){
	            self.images = response.data.photos.photo;
	            self.pages = response.data.photos.pages;
	        });
	    },
	    methods:{
	        copy:function(img){
	        	var id = img.id;	        	
		        var copyText = document.getElementById(id);
		        copyText.select();
		        document.execCommand("Copy");
	        },
	        loadMore: function(){
	            var self = this;
	            if(self.page <= self.pages) {
	            self.$http.get("http://krishdev.com/api/getGalleryCKE?page="+self.page).then(function(response){
	                self.images.push.apply(self.images, response.data.photos.photo);  
	                self.page += 1;                  
	            });
	            }else {
	                this.btnText = "Thats it";
	            }
	            
	        }
	    }
	};
</script>
<style >

</style>