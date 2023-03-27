<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20">
				<el-col :span="3">
					<el-select size="mini" v-model="routeName" @change="routeChange" placeholder="请选择线路">
				   		<el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
			    	</el-select>
				</el-col>
				<el-col :span="4">
					<el-date-picker
                          size="mini"
					      v-model="workdate"
					      type="month"
					      value-format="yyyy-MM"
					      @change="dateChange"
					      placeholder="选择月份">
					</el-date-picker>
				</el-col>
		

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="queryDriverTrip">查询</el-button>
				</el-col>
				<el-col :span="1">
					<el-button type="primary" size="mini" @click="exportData">导出</el-button>
				</el-col>
		 	</el-row>

		 	<el-table
			    max-height="500"
			    size="mini"
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
	import {getRouteMsg,getDriverTrips} from '@/api/gpsApi'
	import {REQ_SUCCESS,baseURL} from '@/api/APIConstans'
	import axios from 'axios'
	import {formatDate} from '@/common/js/dateFmt.js'
	export default{
		name:"driverTrip",
		data(){
			return {
				routeList:[],
				routeName:'',
				workdate:'',
				statisticsType:'1',
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
			queryDriverTrip(){
				let param = {
					workdate:this.workdate,
					routeName:this.routeName,
					statisticsType:this.statisticsType
				};
				getDriverTrips(param).then(resp => {
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
				let index = result.findIndex(ele => ele.driverName == '合计');
				let totalTrip = result[index];
				if(index > - 1){
					result.splice(index,1);
					result.push(totalTrip);	 
				}
				return result;
			},
			exportData(){
				let url = baseURL + "/report/down/driver?routeName=" + this.routeName + "&workdate=" + this.workdate + "&statisticsType=" + this.statisticsType
				axios({
					method:'get',
			        url,
			        responseType:'blob',
				}).then(data => {
					if(!data) {
						return;
					}
					let url = window.URL.createObjectURL(data.data);
			        let link = document.createElement('a');
			        link.style.display = 'none';
			        link.href = url;
			        let fileName = this.routeName + "_司机趟次统计.xlsx";
			        link.setAttribute('download', fileName);
			        document.body.appendChild(link);
			        link.click();
				})

				//let url = baseURL + "/smart/report/down/vehicleMileage?routeName=" + this.query.routeName + "&startDate=" + this.query.startDate + "&endDate=" + this.query.endDate;
		        
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
				let dayObj = {
					id:-1,
					dayStr:"driverName",
					width:80,
					day:"司机"
				}
				dayArr.push(dayObj);

				for(let i = 0; i < endIndex; i++){
					let day = startDate.getDate() + i;
					let dayStr = "v" + day;
					// if(day < 10){
					// 	dayStr = "v0" + day;
					// }
					let dayObj = {
						id:i,
						width:40,
						dayStr:dayStr,
						day:day + ""
					}
					dayArr.push(dayObj);
				}

				let totalObj = {
					id:-2,
					dayStr:"tripCount",
					width:80,
					day:"合计"
				}

				dayArr.push(totalObj);	

				// let attendanceObj = {
				// 	id:-3,
				// 	dayStr:"attendanceCount",
				// 	width:80,
				// 	day:"出勤统计"
				// }

				// dayArr.push(attendanceObj);

				// let totalMileageObj = {
				// 	id:-4,
				// 	dayStr:"totalMileage",
				// 	width:100,
				// 	day:"营运里程"
				// }
				// dayArr.push(totalMileageObj);					

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