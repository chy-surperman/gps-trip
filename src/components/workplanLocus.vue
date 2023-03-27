<template>
	<div>
		<div class="amap-page-container">
		    <el-amap vid="amapDemo"  :center="center" :map-manager="amapManager" :zoom="zoom" :events="events" class="amap-demo">
		    </el-amap>
	    </div>
	    <div style="margin:15px 0;">
	    	<el-button size="mini" type="primary" @click="addWorkplan">添加趟次</el-button>
	    </div>
	    <div style="width:100%;height:1px;"></div>
	</div>
</template>

<script>
	import {getWorkplanGps,generterWorkplanGps} from '@/api/gpsApi'
	import {REQ_SUCCESS,isEnableTiming} from '@/api/APIConstans'
	import { AMapManager } from 'vue-amap';
	let amapManager = new AMapManager();

	export default{
		name:"locusMap",
		data(){
			return {
				gpsSign:'',
		      	zoom: 12,
		        center: [112.998758,28.182349],
		        amapManager,
		        events: {
		            init:this.initPathSimplifierIns
		        },
		        map:{},
		        pathSimplifierIns:{},
		        pathNavigator:{},
		        pathData:[
		        	{
				        name: '轨迹0',
				        path: []
				    }
		        ],
		        startMark:{},
		        endMark:{},
		        gpsData:[],
			}
		},
		created(){
		},
	    mounted(){
	    },
		methods:{
			initPathSimplifierIns(map){
				this.map = map;
				let __this = this;

				//加载线路
				AMapUI.loadUI(['misc/PathSimplifier'], function(PathSimplifier) {
	                __this.createPathSimplifier(PathSimplifier,map);
	            });

				//加载起始站终点站
	            AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
	            	__this.startMark = new SimpleMarker({
		                	iconLabel: "始",
		                  	iconStyle: 'red',
		                  	map: map
		            });
		            __this.endMark = new SimpleMarker({
		                	iconLabel: "终",
		                  	iconStyle: 'blue',
		                  	map: map
		            });
	            });
			},
			createPathNavigator(){
				this.pathNavigator = this.pathSimplifierIns.createPathNavigator(0, {
			            loop: false, //循环播放
			            speed: 120
			    });
			    console.log(this.pathNavigator)
			    this.pathNavigator.on("move",function(e){
			    	console.log(e.target.cursor.idx)
			    });
			},
			createPathSimplifier(PathSimplifier,map){
				console.log("init map createPathSimplifier")
				this.pathSimplifierIns = new PathSimplifier({
					zIndex: 100,
			        map: map, //所属的地图实例
			        getPath: function(pathData, pathIndex) {
			            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
			            return pathData.path;
			        },
			        getHoverTitle: function(pathData, pathIndex, pointIndex) {
			            //返回鼠标悬停时显示的信息
			            if (pointIndex >= 0) {
			                //鼠标悬停在某个轨迹节点上
			                return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
			            }
			            //鼠标悬停在节点之间的连线上
			            return pathData.name + '，GPS点数量' + pathData.path.length;
			        },
			        renderOptions: {
			            //轨迹线的样式
			            pathLineStyle: {
			                strokeStyle: '#409EFF',
			                lineWidth: 6,
			                dirArrowStyle: true
			            }
			        }
				});
			},
			setData(){
				this.pathSimplifierIns.setData(this.pathData);
				this.pathSimplifierIns.render();
			},
			destoryData(){
				if(null != this.vehicleInfoWindow){
					this.vehicleInfoWindow.close();
					this.map.remove(this.vehicleInfoWindow);
				}

				this.gpsData = null;
			},
			addWorkplan(){
				this.$emit('addWorkplan',{
					sign:this.gpsSign
				});
			},
			query(queryForm){
				const loading = this.$loading({
			          lock: true,
			          text: 'Loading',
			          spinner: 'el-icon-loading',
			          background: 'rgba(0, 0, 0, 0.7)'
		        });
				this.destoryData();
				queryForm.filterDrift = 0;
		        getWorkplanGps(queryForm).then(resp => {
					loading.close();
					// if(resp.code == 7){
					// 	this.$confirm('该时间段内车辆无轨迹数据, 是否生成GPS?', '提示', {
					// 		confirmButtonText: '确定',
					// 		cancelButtonText: '取消',
					// 		type: 'warning'
					// 	}).then(() => {
					// 		this.createWorkplanGps(queryForm);
					// 	}).catch(() => {
					// 		this.$message({
					// 			type: 'info',
					// 			message: '已取消删除'
					// 		});          
					// 	});
					// }else 
					if(resp.code == REQ_SUCCESS){
		        		if(resp.result.length == 0){
							this.$message.error("该时间段内车辆无轨迹数据");
		        			return;
		        		}

		        		//设置轨迹数据
		        		this.pathData[0].path = [];
						resp.result.forEach(ele => {
							let point = [ele.longitude,ele.latitude]
							ele.lngLat = point;
							this.pathData[0].path.push(point)
						});
						this.gpsData = resp.result;

						this.setData();
						this.startMark.setPosition(this.pathData[0].path[0]);
						this.endMark.setPosition(this.pathData[0].path[resp.result.length - 1]);
		        	}else{
		        		this.$message.error(resp.define);
		        	}
		        });
			},
			createWorkplanGps(queryForm){
				const loading = this.$loading({
			          lock: true,
			          text: 'Loading',
			          spinner: 'el-icon-loading',
			          background: 'rgba(0, 0, 0, 0.7)'
		        });
				this.destoryData();
				generterWorkplanGps(queryForm).then(resp => {
					loading.close();
		        	if(resp.code == REQ_SUCCESS){
		        		if(resp.result.length == 0){
							this.$message.error("无轨迹数据生成");
						}

						//保存key
						// this.gpsSign = resp.result.sign;
						// sessionStorage.setItem("workplan.gpsSign",resp.result.sign);

		        		//设置轨迹数据
		        		this.pathData[0].path = [];
						resp.result.datas.forEach(ele => {
							let point = [ele.longitude,ele.latitude]
							ele.lngLat = point;
							this.pathData[0].path.push(point)
						});
						this.gpsData = resp.result.datas;

						this.setData();
						this.startMark.setPosition(this.pathData[0].path[0]);
						this.endMark.setPosition(this.pathData[0].path[resp.result.length - 1]);
		        	}else{
		        		this.$message.error(resp.define);
		        	}
				});
			}
		}
	}
</script>

<style scoped>
	.amap-demo {
	  	height: 500px;
	  	width: 100%;
	}
	.map-vehicle{
    	display: block;
    	position: relative;
    	width: 10px;
    	height: 10px;
    	border-radius: 6px;
    }
    .map-vehicle-normal{
		background-color: #67c23a;
    	border-color: #67c23a;
    	border: 1px solid #67c23a;
    }
    .map-vehicle-level{
		background-color: #409eff;
    	border-color: #409eff;
    	border: 1px solid #409eff;
    }
    .map-vehicle-danger{
		background-color: #fa5555;
    	border-color: #fa5555;
    	border: 1px solid #fa5555;
    }
    .map-vehicle em{
    	position: absolute;
    	font-style: normal;
    	font-size: 14px;
    	left: -7px;
    	top: 10px;
    }
</style>