<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer
        :clipped="$vuetify.breakpoint.lgAndUp"
        v-model="drawer"
        fixed
        app
        v-if="hideBars.nav">
        <v-list dense>
          <template v-for="item in items">
            <v-layout
              v-if="item.heading"
              :key="item.heading"
              row
              align-center>
              <v-flex xs6>
                <v-subheader v-if="item.heading">
                  {{ item.heading }}
                </v-subheader>
              </v-flex>
              <v-flex xs6 class="text-xs-center">
                <a href="#!" class="body-2 black--text">EDIT</a>
              </v-flex>
            </v-layout>
            <v-list-group
              v-else-if="item.children"
              v-model="item.model"
              :key="item.text"
              :prepend-icon="item.model ? item.icon : item['icon-alt']"
              append-icon="">
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.text }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile
                v-for="(child, i) in item.children"
                :key="i"
                @click=""
                :href="child.href"
              >
                <v-list-tile-action v-if="child.icon">
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ child.text }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
            <v-list-tile v-else :key="item.text" :href="item.href">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-navigation-drawer
        v-model="drawerRight"
        right
        clipped
        width=800
        app>
        <v-list dense>

            <v-list-tile-content @click.stop="right = !right">
              <Images/>
            </v-list-tile-content>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        color="blue darken-3"
        v-if="hideBars.menu"
        dark
        app
        fixed>
        <v-toolbar-title class="ml-0 pl-3">
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <span class="hidden-sm-and-down">ADMIN</span>
        </v-toolbar-title>
        
        <v-spacer></v-spacer>
        <v-tooltip bottom>
        <v-btn slot="activator" @click="logout" icon>        
          <v-icon>keyboard_tab</v-icon>                
        </v-btn>
        <span>Logout</span>
        </v-tooltip>
        <v-btn icon large href="http://www.chottukieducation.com" target="_blank">
          <v-avatar size="32px" tile>
            <h4>CKE</h4>
          </v-avatar>
        </v-btn>
        <v-btn v-if="showNavIcon" icon @click.stop="drawerRight = !drawerRight">
          <v-icon color="lime">add_photo_alternate</v-icon>
        </v-btn>        
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout>
            <router-view @nav-show="showNav" @nav-show-right="drawerRight = !drawerRight"/>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>    
  </div>
</template>

<script>
import Images from './components/images'
export default {
  name: 'App',
   data: () => ({
      drawer: null,
      right: null,
      drawerRight: false,
      hideBars: {
        nav:true,
        menu:true
      },
      showNavIcon: true,
      items: [
        { icon: 'home', text: 'Home Page', href:'#/' },
        { icon: 'contacts', text: 'Members', href:'#/Members' },        
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Articels',
          model: false,
          children: [
            { icon: 'add', text: 'Create Article', href: "#/WriteArticle" },
            { icon: 'edit', text: 'Handle Article', href: "#/handleArticle" }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Timeline',
          model: false,
          children: [
            { icon: 'add', text: 'Create Timeline | Press', href: "#/timeline"  },
            { icon: 'edit', text: 'Handle Timeline | Press', href: "#/handelTimeline"  }
          ]
        },
        { icon: 'how_to_reg', text: 'Kids', href:'#/kids' },
        { icon: 'photo_album', text: 'Gallery' },
        { icon: 'insert_chart', text: 'Analytics' }
      ]
    }),
   components:{Images},
   created: function(){
    var thisPath = this.$router.currentRoute.name;   
   },
   methods:{
    logout: function(){
        var self = this;
        window.fb.signOut()
    
        .then(function() {
            self.$router.push("Login");
        }, function(error) {
            console.log('Signout Failed')
        });
      },
      showNav:function(val,page, rightDrawer){
        this.hideBars.nav = val;
        this.hideBars.menu = val;
        this.drawerRight = rightDrawer ? rightDrawer : rightDrawer;
        if(page !== "WriteArticle") {
          this.showNavIcon = false;
          this.drawerRight = false;
        }else {
          this.showNavIcon = true;
        }
      }
   }
}
</script>

<style>
#app {

}
</style>
