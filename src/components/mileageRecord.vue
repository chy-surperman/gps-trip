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
					      placeholder="选择月份">
					</el-date-picker>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" size="medium" @click="queryPlans">查询</el-button>
				</el-col>
				<!--<el-col :span="2">
					<el-button type="primary" size="medium" @click="addMileage">添加里程</el-button>
				</el-col>-->
		 	</el-row>

		 	<el-table
			    max-height="500"
			    size="medium"

			    :data="timeTables"
			    align="center"
			    highlight-current-row
			    style="width: 100%">
			     <el-table-column
			      type="index"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="workdate"
			      label="时间"
			      width="300">
			    </el-table-column>
			    <el-table-column
			      prop="selfNum"
			      label="车辆自编号"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="plateNum"
			      label="车牌号"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="totalMileage"
			      label="合计里程(公里)"
			      width="300">
			    </el-table-column>
			    
		 	</el-table>
		</el-row>
		<mileageDialog :showMileageDialog="showMileageDialog" :mileage="mileageData" @closeDialog="closeDialog"></mileageDialog>
	</div>
</template>
<script>
	import {getRouteMsg,getVehicleMileage,deleteVehicleMileage} from '@/api/gpsApi'
	import {REQ_SUCCESS,isEnableTiming} from '@/api/APIConstans'
	import {formatDate} from '@/common/js/dateFmt.js'
	import mileageDialog from '@/components/mileageDialog'
	export default{
		name:"mileageRecord",
		components:{
			mileageDialog
		},
		data(){
			return {
				routeList:[],
				routeName:'',
				workdate:'',
				plateNum:'',
				timeTables:[],
				showMileageDialog:false,
				mileageData:{}
			}
		},
		methods:{
			_getRouteLis(){
				getRouteMsg().then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.routeList = resp.result;
						this.routeName = this.routeList[0];
						this._getVehicleMileage();
					}
				})
			},
			_getVehicleMileage(){
				console.log(this.workdate)
				let param = {
					routeName:this.routeName,
					workdate:this.workdate
				}
				getVehicleMileage(param).then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.timeTables = resp.result;
					}
				});
			},
			routeChange(val){

			},
			addMileage(){
				this.showMileageDialog = true;
			},
			closeDialog(flag){
				this.showMileageDialog = false;
				if(flag == "success"){
					this._getVehicleMileage();
				}
			},
			queryPlans(){
				this._getVehicleMileage();
			},
			deletePlan(index,timeTables){
				this.$confirm('是否删除?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let params = {
		        		id:timeTables[index].id
		        	};
		        	deleteVehicleMileage(params).then(resp => {
		        		if(resp.code == REQ_SUCCESS){
		        			this._getVehicleMileage();
							this.$message.success("删除成功");
						}else{
							this.$message.success("删除失败");
						}
		        	})
		        }).catch(() => {

		        });
			},
			modify(index,timeTables){
				this.mileageData = this.timeTables[index];
				this.showMileageDialog = true;
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