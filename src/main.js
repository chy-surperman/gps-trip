// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ELEMENT from 'element-ui'
import AMap from 'vue-amap';
import App from './App'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'
import './resources/css/style.css'
import './resources/css/iconfont.css'

Vue.config.productionTip = false
Vue.use(ELEMENT)
Vue.use(AMap);

AMap.initAMapApiLoader({
  key: '519f7438b2dc6d309ff1a1950b9e32db',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  uiVersion: '1.0' // 版本号
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

// router.beforeEach((to, from, next) => {
// 	if(to.path.indexOf("login") == -1){
// 		//判断是否登录
// 		if(sessionStorage.getItem("loginInfo.gpsUserId") == undefined){
// 			next({
// 				path: '/login'
// 			})
// 		}else{
// 			next();
// 		}
// 	}else{
// 		next();
// 	}
// })
