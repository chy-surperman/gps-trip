<template>
  <div class="wrap-map">
    <div class="amap-page-container">
        <el-amap vid="amapDemo" :style="{ height: wrapperHeight + 'px' }" :center="center" :map-manager="amapManager" :zoom="zoom" :events="events" class="amap-demo">
        </el-amap>
      </div>
      <div class="running-info-panel">
        <el-button type="primary" size="small" @click="start">开始</el-button>
        <el-button type="primary" size="small" @click="pause">暂停</el-button>
        <el-button type="primary" size="small" @click="reset">重置</el-button>
      </div>
      <div class="query-form-panel">
        <el-collapse>
          <el-collapse-item title="查询面版">
            <el-form  class="query-form-box" ref="form" :model="queryForm" label-width="80px">
            <el-form-item label="起始时间">
                <el-col :span="20">
                  <el-date-picker
                    @change="timeChange"
                    v-model="queryForm.startTime"
                    type="datetime"
                    size="medium"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-col :span="20">
                  <el-date-picker
                    v-model="queryForm.endTime"
                    @change="timeChange"
                    size="medium"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="线路">
                <el-col :span="20">
                  <el-select filterable @change="routeChange" v-model="queryForm.routeName" size="medium" placeholder="请选择线路">
                    <el-option v-for="routeName in routeList" :key="routeName"
                          :label="routeName" :value="routeName"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="车牌号">
                <el-col :span="20">
                  <el-select filterable v-model="queryForm.vehicleId" size="medium" placeholder="请选择线路">
                      <el-option v-for="vehicle in vehicles" :key="vehicle.vehicleId"
                            :label="vehicle.selfNum" :value="vehicle.vehicleId">
                        <span style="float: left">{{ vehicle.selfNum }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ vehicle.plateNum }}</span>
                      </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
          </el-form>
          <el-row>
            <el-col>
              <el-button type="primary" size="small" v-loading.fullscreen.lock="fullscreenLoading" @click="query">查询轨迹</el-button>
              <!--<el-button type="primary" size="small" v-loading.fullscreen.lock="fullscreenLoading" @click="saveSupplement">保存</el-button>-->
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      </div>
  </div>
</template>

<script>
  import {getRouteMsg,getGpsData,saveMeta,getGpsVehicles,getGpsTrack,getWorplanGps,getDynamicVehicles} from '@/api/gpsApi'
  import {REQ_SUCCESS,isEnableTiming} from '@/api/APIConstans'
  import { AMapManager } from 'vue-amap';
  let amapManager = new AMapManager();

  export default{
    name:"locusMap",
    data(){
      return {
        wrapperHeight:650,
        fullscreenLoading:false,
        queryForm:{
          startTime:'',
          vehicleId:'',
          endTime:'',
          plateNum:'',
          routeName:'',
          terminal:'',
          starttag:''
        },
        routeList:[],
        vehicles:[],
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
                path: [
                    // [100.340417, 27.376994],
                    // [108.426354, 37.827452],
                    // [113.392174, 31.208439],
                    // [124.905846, 42.232876]
                ]
            }
            ],
            startMark:{},
            endMark:{},
            vehicleMark:{},
            showVehicleMarker:[],
            gpsData:[],
            runingPoint:{
              reportTime:'',
              speed:''
            },
            vehicleInfoWindow:null,
            timeOut:{},
            locusPointIndex:0
      }
    },
    created(){
      this._getRouteMsg();
    },
    mounted(){
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.wrapperHeight = height - 62;
    },
    methods:{
      _getRouteMsg(){
        getRouteMsg().then(resp => {
          if(resp.code == REQ_SUCCESS){
            this.routeList = resp.result;
            this.queryForm.routeName = this.routeList[0];
            this._getGpsVehicles();
          }
        });
      },
      _getGpsVehicles(){
        let param = {
          ...this.queryForm
        }
        getGpsVehicles(param).then(resp => {
          if(resp.code == REQ_SUCCESS){
            this.vehicles = resp.result;
            this.queryForm.plateNum = this.vehicles[0].plateNum;
          }
        });
      },
      routeChange(){
        this._getGpsVehicles();
      },
      timeChange(){
        this._getGpsVehicles();
      },
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
      createVehiclePointContent(){
        let info = document.createElement("div");
        info.style.width = "24px";
        info.style.height = "24px";
        info.style.borderRadius = "12px";

        info.style.backgroundColor = "#67c23a";
        info.style.borderColor="#67c23a";
        info.style.border="1px solid #67c23a"

            let em = document.createElement("em");
            em.style.color="#FFF";
            em.innerHTML = "car";
            info.appendChild(em);

            return info;
      },
      createVehicleInfoWindow(gps){
        let time = document.createElement("div");

            let timeStrong = document.createElement("strong")
            timeStrong.innerHTML = "时间:";
            time.appendChild(timeStrong);

            let timeSpan = document.createElement("span")
            const timeStr = gps.reportTime.split(" ");
            timeSpan.innerHTML = timeStr[1];
            time.appendChild(timeSpan);

            let speed = document.createElement("div");

            let speedStrong = document.createElement("strong")
            speedStrong.innerHTML = "车速:";
            speed.appendChild(speedStrong);

            let speedSpan = document.createElement("span")
            speedSpan.innerHTML = Math.floor(parseFloat(gps.speed) * 100) / 100   + "km/h";
            speed.appendChild(speedSpan);

            let wrapper = document.createElement("div")
            wrapper.style.width = 120 + "px";
            wrapper.appendChild(time);
            wrapper.appendChild(speed);

            return wrapper;
      },
      createPathSimplifier(PathSimplifier,map){
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
      moveVehicle(index){
        if(index >= this.gpsData.length){
          clearTimeout(this.timeOut);
          return;
        }
        this.vehicleMark.setPosition(this.gpsData[index].lngLat);
        this.vehicleInfoWindow.setContent(this.createVehicleInfoWindow(this.gpsData[index]));
        this.vehicleInfoWindow.open(this.map, this.gpsData[index].lngLat);
        this.timeOut = setTimeout(() => {
          this.locusPointIndex = index + 1;
          this.moveVehicle(this.locusPointIndex)
        }, 500);
      },
      destoryData(){
        clearTimeout(this.timeOut);
        if(null != this.vehicleInfoWindow){
          this.vehicleInfoWindow.close();
          this.map.remove(this.vehicleInfoWindow);
        }
        this.map.remove(this.vehicleMark);
        this.gpsData = null;
      },
      query(){
        this.fullscreenLoading = true;
        this.destoryData();
        // getGpsTrack
        // getGpsTrack
        getGpsTrack(this.queryForm).then(resp => {
          this.fullscreenLoading = false;
          if(resp.code != REQ_SUCCESS){
            this.$message.error(resp.define);
            return;
          }

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
              if(!ele.reportTime){
                ele.reportTime = ele.time;
              }
              this.pathData[0].path.push(point)
            });
            this.gpsData = resp.result;

            this.setData();
            this.startMark.setPosition(this.pathData[0].path[0]);
            this.endMark.setPosition(this.pathData[0].path[resp.result.length - 1]);

            //车辆随轨迹移动
            this.locusPointIndex = 0;
            this.vehicleMark = new AMap.Marker({
                    offset : new AMap.Pixel(-12,-12),
                    map : this.map,
                    content:this.createVehiclePointContent(),
                    zIndex:1002
            });
            this.vehicleInfoWindow = new AMap.InfoWindow();
          }else{
              this.$message.error(resp.define);
          }
        }).catch(() => {
          this.fullscreenLoading =false;
          this.$message.error("错误");
        });
      },
      start(){
        this.moveVehicle(this.locusPointIndex);
      },
      reset(){
        clearTimeout(this.timeOut);
        this.locusPointIndex = 0;
      },
      pause(){
        clearTimeout(this.timeOut);
      },
      saveSupplement(){
        this.fullscreenLoading = true;
        saveMeta(this.queryForm).then(resp => {
          this.fullscreenLoading = false;
          if(resp.code != REQ_SUCCESS){
            this.$message.error(resp.define);
            return;
          }else{
            this.queryForm.startDate = '';
            this.queryForm.endDate = '';
            this.$message.success("保存成功");
          }
        });
      }
    }
  }
</script>

<style scoped>

  .wrap-map{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .amap-demo {
      height: 400px;
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
    .query-form-panel{
      position: absolute;
      left: 20px;
      top: 0;
      background: #fff;
      width: 350px;
    }
    .running-info-panel{
      position: absolute;
      right: 20px;
      top: 0;
      background: #fff;
      width: 350px;
      height: 49px;
      line-height: 49px;
    }
</style>
