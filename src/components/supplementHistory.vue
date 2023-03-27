<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20">
				<el-col :span="3">
					<el-select  v-model="routeName" @change="routeChange" placeholder="请选择线路">
				   		<el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
			    	</el-select>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" size="medium" @click="queryPlans">查询</el-button>
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
			      type="index"
			      width="60">
			    </el-table-column>
			    <el-table-column
			      prop="startDate"
			      label="起始时间"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="endDate"
			      label="结束时间"
			      width="200">
			    </el-table-column>
			    <el-table-column
			      prop="routeName"
			      label="线路名称"
			      width="150">
			    </el-table-column>
			    <el-table-column
			      prop="plateNum"
			      label="车牌号"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="starttag"
			      label="方向"
			      width="100">
			    </el-table-column>
			    <el-table-column
			      prop="terminal"
			      label="终端编号"
			      width="200">
				</el-table-column>
			    <el-table-column
			      prop="operatingDate"
			      label="操作时间"
			      width="200">
			    </el-table-column>
			</el-table>
		</el-row>
	</div>
</template>

<script>
	import {getRouteMsg,getSupplementMetas} from '@/api/gpsApi'
	import {REQ_SUCCESS,isEnableTiming} from '@/api/APIConstans'
	export default{
		data(){
			return {
				routeList:[],
				routeName:'',
				timeTables:[]
			}
		},
		methods:{
			createSchedule(){
				if(null == this.routeName || this.routeName == ''){
					this.$message.error("请选择线路");
					return;
				}
				this.$router.push({
					path:URLConstans.createTimetable,
					query:{
						routeName:this.routeName
					}
				});
			},
			_getRouteLis(){
				getRouteMsg().then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.routeList = resp.result;
						this.routeName = this.routeList[0];
						this._getSupplementMetas();
					}
				})
			},
			_getSupplementMetas(){
				let param = {
					routeName:this.routeName
				}
				getSupplementMetas(param).then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.timeTables = resp.result;
					}
				});
			},
			routeChange(val){

			},
			queryPlans(){
				this._getSupplementMetas();
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