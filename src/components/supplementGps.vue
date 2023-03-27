<template>
	<div class="schedule-wrap">

		<div  class="schedule-panel">
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">轨迹查询</el-menu-item>
        <!-- <el-menu-item index="7">车辆月里程</el-menu-item> -->
        <!-- <el-menu-item index="3">里程记录</el-menu-item>  -->
        <!-- <el-menu-item index="2">驾驶员车辆趟次统计</el-menu-item> -->
        <!--<el-menu-item index="5">车辆趟次统计</el-menu-item> -->
        <!--<el-menu-item index="10">驾驶员趟次统计</el-menu-item> -->

        <el-menu-item index="4">日报表</el-menu-item>
        <!--				  	<el-menu-item index="8">趟次管理</el-menu-item>-->
        <el-menu-item index="11">趟次录入</el-menu-item>
        <el-menu-item index="12">趟次更新（轨迹不变）</el-menu-item>
					<!--<el-menu-item index="9">站点地图</el-menu-item> -->
					<!--<el-menu-item index="6">线路轨迹</el-menu-item> -->
			</el-menu>
			<!--路由出口-->
            <router-view></router-view>
		</div>
	</div>
</template>

<script>
	export default{
		name:'supplementGps',
		data(){
			return {
				activeIndex:"1"
			}
		},
		created(){
			if(this.$route.path == "/supplement"){
				this.activeIndex = "1"
			}else if(this.$route.path == "/driverVehicleTrip"){
				this.activeIndex = "2"
			}else if(this.$route.path == "/mileageRecord"){
				this.activeIndex = "3"
			}else if(this.$route.path == "/bigDailyReport"){
				this.activeIndex = "4"
			}else if(this.$route.path == "/vehicleTrip"){
				this.activeIndex = "5"
			}else if(this.$route.path == "/routeLocus"){
				this.activeIndex = "6"
			}else if(this.$route.path == "/vehicleMileage"){
				this.activeIndex = "7"
			}else if(this.$route.path == "/workplanManager"){
				this.activeIndex = "8"
			}else if(this.$route.path == "/siteMap"){
				this.activeIndex = "9"
			}else if(this.$route.path == "/driverTrip"){
				this.activeIndex = "10"
			}else if (this.$route.path == "/workplanManagerSave"){
        this.activeIndex = "11"
      }else  if(this.$route.path == "/workplanManager"){
        this.activeIndex = "12"
      }
		},
		methods:{
			handleSelect(key, keyPath) {
		        if(key == '1'){
		        	this.$router.push("/supplement")
		        }else if(key == '2'){
		        	this.$router.push("/driverVehicleTrip")
		        }else if(key == '3'){
		        	this.$router.push("/mileageRecord")
		        }else if(key == '4'){
		        	this.$router.push("/bigDailyReport")
		        }else if(key == '5'){
		        	this.$router.push("/vehicleTrip")
		        }else if(key == '6'){
		        	this.$router.push("/routeLocus")
		        }else if(key == '7'){
		        	this.$router.push("/vehicleMileage")
		        }else if(key == '8'){
		        	this.$router.push("/workplanManager")
		        }else if(key == '9'){
		        	this.$router.push("/siteMap")
		        }else if(key == '10'){
		        	this.$router.push("/driverTrip")
		        }else if(key == '11'){
              this.$router.push("/workplanManagerSave")
		        }else if(key == '12'){
              this.$router.push("/workplanManager")
            }
		}
	}}
</script>
<style scoped>
	.schedule-wrap{
		height: 99%;
		background: #fff;
	}
	.schedule-header{
		padding-top: 10px;
		padding-left: 20px;
	}
	.grid-content {
		margin-top: 10px;
        border-radius: 4px;
  	}
  	.schedule-panel {
  	}
</style>
