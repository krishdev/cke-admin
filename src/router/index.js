import Vue from 'vue'
import Router from 'vue-router'
import Members from '@/components/Members'
import Home from '@/components/Home'
import Login from '@/components/Login'
import WriteArticle from '@/components/WriteArticle'
import HandleArticle from '@/components/HandleArticle'
import Timeline from '@/components/Timeline'
import HandleTimeline from '@/components/HandleTimeline'
import Kids from '@/components/Kids'
//import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  routes: [
    {
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			requiresAuth: true
		}
    },
    {
		path: '/login',
		name: 'Login',
		component: Login	
    },
    {
    	path: '/members',
    	name: 'Members',
    	component: Members
    },
    {
    	path: '/WriteArticle',
    	name: 'WriteArticle',
    	component: WriteArticle
    },
    {
    	path: '/handleArticle',
    	name: 'HandleArticle',
    	component: HandleArticle
    },
    {
    	path: '/timeline',
    	name: 'Timeline',
    	component: Timeline
    },
    {
    	path: '/handelTimeline',
    	name: 'HandleTimeline',
    	component: HandleTimeline
    },
    {
    	path: '/kids',
    	name: 'Kids',
    	component: Kids
    }
  ],
  scrollBehavior(to, from, savedPosition) {
  	return {X: 0, y:0}
  }
})

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	var isAuthenticated = false;
	//window.scrollTo(0, 0);
 	
	window.fb.onAuthStateChanged(function(user) {
		isAuthenticated = user ? user.emailVerified : false;
		if (requiresAuth && !isAuthenticated) {
			next('/login');
		} else {
			next();
		}
	});
	

})
export default router;