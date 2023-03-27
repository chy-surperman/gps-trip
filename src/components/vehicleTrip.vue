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
					<el-button type="primary" size="mini" @click="queryTripDetail">查询</el-button>
				</el-col>
				<el-col :span="1">
					<el-button type="primary" size="mini" @click="exportData">导出</el-button>
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
		<el-row :gutter="20" style="margin-top:20px;">
			<el-col :span="10" :offset="12">
				<el-pagination
				      @size-change="downHandleSizeChange"
				      @current-change="downHandleCurrentChange"
				      :current-page="downPagination.currentPage"
				      :page-sizes="downPagination.pageSizes"
				      :page-size="downPagination.pageSize"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="downPagination.total">
			    </el-pagination>
			</el-col>	
		</el-row>
	</div>
</template>
<script>
	import {getRouteMsg,getVehicleMileage,getDriverTrip,getVehicleTrip} from '@/api/gpsApi'
	import {REQ_SUCCESS,baseURL} from '@/api/APIConstans'
	import axios from 'axios'
	import {formatDate} from '@/common/js/dateFmt.js'
	export default{
		name:"vehicleTripDetail",
		data(){
			return {
				routeList:[],
				routeName:'',
				workdate:'',
				plateNum:'',
				statisticsType:'1',
				timeTables:[],
				showMileageDialog:false,
				mileageData:{},
				days:[],
				downPagination:{
		        	currentPage:1,
		        	pageSizes:[10,20,30,40],
		        	pageSize:10,
		        	total:40
		        }
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
			queryTripDetail(){
				let param = {
					workdate:this.workdate,
					routeName:this.routeName,
					statisticsType:this.statisticsType,
					page:this.downPagination.currentPage,
					pageSize:this.downPagination.pageSize
				};
				getVehicleTrip(param).then(resp => {
					if(resp.code == REQ_SUCCESS){
						// this.timeTables = this.handlerResult(resp.result);
						this.timeTables = resp.result.dataList;
						this.downPagination.total = resp.result.totalCount;
					}
				});
			},
			downHandleSizeChange(val) {
				this.downPagination.pageSize = val;
		        this.queryTripDetail()
		    },
		    downHandleCurrentChange(val) {
		    	this.downPagination.currentPage = val;
		        this.queryTripDetail()
			},
			exportData(){
				let url = baseURL + "/report/down/vehicle?routeName=" + this.routeName + "&workdate=" + this.workdate + "&statisticsType=" + this.statisticsType
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
			        let fileName = this.routeName + "_车辆趟次统计.xlsx";
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
				
				let selfNumObj = {
					id:-2,
					dayStr:"selfNum",
					width:70,
					day:"车号"
				}
				dayArr.push(selfNumObj);

				for(let i = 0; i < endIndex; i++){
					let day = startDate.getDate() + i;
					let dayStr = "v" + day;
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
					width:70,
					day:"合计"
				}
				dayArr.push(totalObj);

				let standTripMileage = {
					id:-3,
					dayStr:"standTripMileage",
					width:70,
					day:"趟公里"
				}
				dayArr.push(standTripMileage);

				let mileageObj = {
					id:-4,
					dayStr:"totalMileage",
					width:80,
					day:"班次公里数"
				}
				dayArr.push(mileageObj);				

				let gpsMileageTotal = {
					id:-4,
					dayStr:"gpsMileageTotal",
					width:80,
					day:"GPS公里数"
				}
				dayArr.push(gpsMileageTotal);				

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