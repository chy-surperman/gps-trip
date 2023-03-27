import Vue from 'vue'
import VueRouter from 'vue-router'

const addSupplement = () => import('@/components/addSupplement')
//import addSupplement from '@/components/addSupplement'
const supplementGps = () => import('@/components/supplementGps')
// import supplementGps from '@/components/supplementGps'
const supplementHistory = () => import('@/components/supplementHistory')
// import supplementHistory from '@/components/supplementHistory'
const login = () => import('@/components/login')
// import login from '@/components/login'
const mileageRecord = () => import('@/components/mileageRecord')
// import mileageRecord from '@/components/mileageRecord'
const bigDailyReport = () => import('@/components/bigDailyReport')
// import bigDailyReport from '@/components/bigDailyReport'
const driverVehicleTrip = () => import('@/components/driverVehicleTrip')
// import driverTrip from '@/components/driverTrip'

const vehicleTrip = () => import('@/components/vehicleTrip')
const driverTrip = () => import('@/components/driverTrip')
const vehicleMileage = () => import('@/components/vehicleMileage')
const routeLocus = () => import('@/components/routeLocus')
const workplanManager = () => import('@/components/workplanManager')
const workplanManagerSave = () => import('@/components/workplanManagerSave')
const siteMap = () => import('@/components/siteMap')


Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: "/login",
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'supplementGps',
      redirect:"/login",
      component: supplementGps,
      children:[
      	{
	     	path: "/supplement",
		    name: 'addSupplement',
		    component: addSupplement
  	    },
  	    {
  	     	path: "/supplementHistory",
  		    name: 'supplementHistory',
  		    component: supplementHistory
  	    },

        // {
        //   path: "/driverVehicleTrip",
        //   name: 'driverVehicleTrip',
        //   component: driverVehicleTrip
        // },
        // {
        //   path: "/vehicleTrip",
        //   name: 'vehicleTrip',
        //   component: vehicleTrip
        // },
        // {
        //   path: "/driverTrip",
        //   name: 'driverTrip',
        //   component: driverTrip
        // },
        {
          path: "/bigDailyReport",
          name: 'bigDailyReport',
          component: bigDailyReport
        },

        {
          path: "/mileageRecord",
          name: 'mileageRecord',
          component: mileageRecord
        },
        // {
        //   path: "/routeLocus",
        //   name: 'routeLocus',
        //   component: routeLocus
        // },
        // {
        //   path: "/vehicleMileage",
        //   name: 'vehicleMileage',
        //   component: vehicleMileage
        // },
        {
          path: "/workplanManager",
          name: 'workplanManager',
          component: workplanManager
        },
        {
          path: "/workplanManagerSave",
          name: 'workplanManagerSave',
          component: workplanManagerSave
        },
      ]
    }
  ]
})
