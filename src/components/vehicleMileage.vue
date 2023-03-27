<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20">
				<el-col :span="3">
					<el-select  v-model="routeName" @change="routeChange" placeholder="请选择线路">
				   		<el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
			    	</el-select>
				</el-col>
				<el-col :span="4">
					<el-date-picker
					      v-model="workdate"
					      type="month"
					      value-format="yyyy-MM"
					      @change="dateChange"
					      placeholder="选择月份">
					</el-date-picker>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" size="medium" @click="queryVehicleTrip">查询</el-button>
				</el-col>
		 	</el-row>

		 	<el-table
			    max-height="500"
			    size="medium"
			    :data="timeTables"
			    align="center"
			    highlight-current-row
			    style="width: 100%">
			    <el-table-column 
			      v-for="dayObj in days" 
			      :prop="dayObj.dayStr" 
			      :label="dayObj.day" 
			      :key="dayObj.id" 
			      :width="dayObj.width">
			    </el-table-column>
		 	</el-table>
		</el-row>
	</div>
</template>
<script>
	import {getRouteMsg,queryMileage,getDriverTrip,getVehicleTrip} from '@/api/gpsApi'
	import {REQ_SUCCESS,isEnableTiming} from '@/api/APIConstans'
	import {formatDate} from '@/common/js/dateFmt.js'
	export default{
		name:"driverTrip",
		data(){
			return {
				routeList:[],
				routeName:'',
				workdate:'',
				plateNum:'',
				timeTables:[],
				showMileageDialog:false,
				mileageData:{},
				days:[]
			}
		},
		methods:{
			_getRouteLis(){
				getRouteMsg().then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.routeList = resp.result;
						this.routeName = this.routeList[0];
					}
				})
			},
			queryVehicleTrip(){
				let param = {
					month:this.workdate,
					routeName:this.routeName
				};
				queryMileage(param).then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.timeTables = this.handlerResult(resp.result);
					}
				});
			},
			handlerResult(result){
				let dayArr = this.days;
				result.forEach(ele => {
					for(let i = 0; i < dayArr.length; i++){
						if(undefined == ele[dayArr[i].dayStr] || null == ele[dayArr[i].dayStr]){
							ele[dayArr[i].dayStr] = 0;
						}
                    }
                    
                });
                console.log(result);
				return result;
			},
			dateChange(val){
				this.createDay();
			},
			routeChange(val){

			},
			createDay(){
				let datestr = this.workdate.split("-");
				let date = new Date(parseInt(datestr[0]),parseInt(datestr[1]),0);

				let endIndex = date.getDate()
				let startDate = new Date(parseInt(datestr[0]),parseInt(datestr[1]) - 1, 1);
				
				let dayArr = [];
				let selfNumObj = {
					id:-1,
					dayStr:"selfNum",
					width:90,
					day:"自编号"
				}
				dayArr.push(selfNumObj);

				for(let i = 0; i < endIndex; i++){
					let day = startDate.getDate() + i;
					let dayStr = "v" + day;
					if(day < 10){
						dayStr = "v0" + day;
					}
					let dayObj = {
						id:i,
						width:80,
						dayStr:dayStr,
						day:day + ""
					}
					dayArr.push(dayObj);
				}

				let totalObj = {
					id:-2,
					dayStr:"total",
					width:110,
					day:"合计"
				}

				dayArr.push(totalObj);				
				this.days = dayArr;

				this.timeTables = [];
			}
		},
		created(){
			this._getRouteLis();
		}
	}
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
	.meta-panel{
		padding: 20px 10px 0 10px; 
	}
	.grid-content {
		margin-top: 10px;
        border-radius: 4px;
  	}
  	.schedule-panel {
  		margin: 15px;
  	}
</style>