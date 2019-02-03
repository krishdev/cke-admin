<template>
	<v-content style="padding:0">
		<v-layout row wrap>
		 	<v-flex xs12 md4 pa-2>
	            <v-card color="purple darken-2" class="white--text">
	              <v-card-title primary-title>
	                <div class="headline">Members</div>                
	              </v-card-title>
	              <v-card-title>Total number of members  
	              	<v-avatar color="purple accent-2" style="margin-left: 1em;">
				      <span class="white--text headline">{{memberLength}}</span>
				    </v-avatar>
					</v-card-title>
	              <v-card-actions>
	                <v-btn style="margin-left: 0;" flat dark href="#/members">Handle it</v-btn>
	              </v-card-actions>
	            </v-card>
	            <canvas id="memberGraph" width="400" height="200"></canvas>
	     	</v-flex>
	     	<v-flex xs12 md4 pa-2>
	            <v-card color="cyan darken-1" class="white--text">
	              <v-card-title primary-title>
	                <div class="headline">Timeline</div>                
	              </v-card-title>
	              <v-card-title>Total number of timeline  
	              	<v-avatar color="green lighten-1" style="margin-left: 1em;">
				      <span class="white--text headline">{{timelineLength}}</span>
				    </v-avatar>
					</v-card-title>
	              <v-card-actions>
	                <v-btn style="margin-left: 0;" flat dark href="#/timeline">Handle it</v-btn>
	              </v-card-actions>
	            </v-card>
	            <canvas id="timelineGraph" width="400" height="200"></canvas>
	     	</v-flex>
	     	<v-flex xs12 md4 pa-2>
	            <v-card color="brown lighten-1" class="white--text">
	              <v-card-title primary-title>
	                <div class="headline">Articles</div>                
	              </v-card-title>
	              <v-card-title>Total number of articles  
	              	<v-avatar color="purple accent-2" style="margin-left: 1em;">
				      <span class="white--text headline">{{ articleLength }}</span>
				    </v-avatar>
					</v-card-title>
	              <v-card-actions>
	                <v-btn style="margin-left: 0;" flat dark href="#/handleArticle">Handle it</v-btn>
	              </v-card-actions>
	            </v-card>
	            <canvas id="articleGraph" width="400" height="200"></canvas>
	     	</v-flex>
	     	<v-flex xs12 md4 pa-2>
	            <v-card color="lime darken-2" class="white--text">
	              <v-card-title primary-title>
	                <div class="headline">Press</div>                
	              </v-card-title>
	              <v-card-title>Total number of press notes  
	              	<v-avatar color="purple accent-2" style="margin-left: 1em;">
				      <span class="white--text headline">{{pressLength}}</span>
				    </v-avatar>
					</v-card-title>
	              <v-card-actions>
	                <v-btn style="margin-left: 0;" flat dark href="#/timeline">Handle it</v-btn>
	              </v-card-actions>
	            </v-card>
	            <canvas id="pressGraph" width="400" height="200"></canvas>
	     	</v-flex>	     	
		</v-layout>		
	</v-content>
</template>
<script>
	import { db,storageRef } from '../main'
	import LineExample from 'vue-chartjs'
	
	export default {
		name:"Home",
		
		data: () => ({
			memberLength: 0,
			timelineLength: 0,
			pressLength: 0,
			articleLength: 0,
			members: [],
			timeline: [],
			press: [],
			article: [],
			months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			memberGraphData: {},
			articleGraphData: {},
			timelineGraphData: {},
			pressGraphData: {}
		}),
		created:function() {
			var self = this;

			this.$emit("nav-show",true,"Home");
			var self = this;
			var ref = db.ref();

			db.ref("members").on("value", function(response){
				self.members = response.val();
		        self.memberLength = Object.keys(response.val()).length; 
		        self.memberGraph()
		    });
		    db.ref("timeline").on("value", function(response){
		    	self.timeline = response.val();
		        self.timelineLength = Object.keys(response.val()).length; 
		        self.timelineGraph();
		    });
		    db.ref("press").on("value", function(response){
		    	self.press = response.val();
		        self.pressLength = Object.keys(response.val()).length; 
		        self.pressGraph();
		    });
		    db.ref("posts").on("value", function(response){
		    	self.article = response.val();
		        self.articleLength = Object.keys(response.val()).length; 
		        self.articleGraph();
		    });
		},
		methods: {
			"memberGraph" : function() {
				var self = this;
				
				var month = {
					"Jan": 0,
					"Feb": 0,
					"Mar": 0,
					"Apr": 0,
					"May": 0,
					"Jun": 0,
					"Jul": 0,
					"Aug": 0,
					"Sep": 0,
					"Oct": 0,
					"Nov": 0,
					"Dec": 0
				};
				var date;
				var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				for(var k in self.members){
					date = new Date(self.members[k].date);
					month[months[date.getUTCMonth()]] += 1;
				}
				
				self.memberGraphData = month;

				var numArray = [];
				numArray = Object.values(self.memberGraphData);

				this.barChartMonth(numArray, "memberGraph", "This Year Stats");

			},
			"timelineGraph" : function() {
				var self = this;
				
				var month = {
					"Jan": 0,
					"Feb": 0,
					"Mar": 0,
					"Apr": 0,
					"May": 0,
					"Jun": 0,
					"Jul": 0,
					"Aug": 0,
					"Sep": 0,
					"Oct": 0,
					"Nov": 0,
					"Dec": 0
				};
				var date;
				var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				for(var k in self.timeline){
					date = new Date(self.timeline[k].date);
					month[months[date.getUTCMonth()]] += 1;
				}
				
				self.timelineGraphData = month;
				var numArray = [];
				numArray = Object.values(self.timelineGraphData);
				this.barChartMonth(numArray, "timelineGraph", "This Year Stats");
			},
			"articleGraph" : function() {
				var self = this;
				
				var month = {
					"Jan": 0,
					"Feb": 0,
					"Mar": 0,
					"Apr": 0,
					"May": 0,
					"Jun": 0,
					"Jul": 0,
					"Aug": 0,
					"Sep": 0,
					"Oct": 0,
					"Nov": 0,
					"Dec": 0
				};
				var date;
				var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				for(var k in self.article){
					date = new Date(self.article[k].date);
					month[months[date.getUTCMonth()]] += 1;
				}
				
				self.articleGraphData = month;	
				var numArray = [];
				numArray = Object.values(self.articleGraphData);
				this.barChartMonth(numArray, "articleGraph", "This Year Stats");
			},
			"pressGraph" : function() {
				var self = this;
				
				var month = {
					"Jan": 0,
					"Feb": 0,
					"Mar": 0,
					"Apr": 0,
					"May": 0,
					"Jun": 0,
					"Jul": 0,
					"Aug": 0,
					"Sep": 0,
					"Oct": 0,
					"Nov": 0,
					"Dec": 0
				};
				var date;
				var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				for(var k in self.press){

					if(k) {
						date = new Date(self.press[k].date);
						month[months[date.getUTCMonth()]] += 1;
					}
				}
				
				self.pressGraphData = month;
				var numArray = [];
				numArray = Object.values(self.pressGraphData);
				this.barChartMonth(numArray, "pressGraph", "This Year Stats");
			},
			"barChartMonth" : function(data,id,label) {		
				var datat = data,
					id = id,
					label = label;

				var self = this;		
				setTimeout(function() {
					var canvas = document.getElementById(id);
					var data = {
					    labels: self.months,
					    datasets: [
					        {
					            label: label,
					            backgroundColor: "rgba(255,99,132,0.2)",
					            borderColor: "rgba(255,99,132,1)",
					            borderWidth: 2,
					            hoverBackgroundColor: "rgba(255,99,132,0.4)",
					            hoverBorderColor: "rgba(255,99,132,1)",
					            data: datat,
					        }
					    ]
					};
					var option = {
						scales: {
					  	yAxes:[{
					    		stacked:true,
					        gridLines: {
					        	display:true,
					          color:"rgba(255,99,132,0.2)"
					        }
					    }],
					    xAxes:[{
					    		gridLines: {
					        	display:false
					        }
					    }]
					  }
					};
					var myBarChart = Chart.Bar(canvas,{
						data:data,
					  	options:option
					});
				},1000);
			}
		}
	}
</script>
<style>

</style>