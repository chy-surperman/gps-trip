<template>
    <div class="wrap-map">
        <div class="amap-page-container">
            <el-amap
                vid="amapDemo"
                :style="{ height: wrapperHeight + 'px' }"
                :center="center"
                :map-manager="amapManager"
                :zoom="zoom"
                :events="events"
                class="amap-demo"
            >
                <el-amap-marker 
                    v-for="(marker, index) in markerList" 
                    :position="marker.position" 
                    :visible="marker.visible" 
                    :events="marker.events"
                    :key="index" 
                    :vid="index"></el-amap-marker>
            </el-amap>
        </div>
        <div class="query-form-panel">
            <el-collapse>
                <el-collapse-item title="查询面版">
                    <el-form
                        class="query-form-box"
                        ref="form"
                        :model="queryForm"
                        label-width="80px"
                    >
                        <el-form-item label="线路">
                            <el-col :span="20">
                                <el-select
                                    filterable
                                    v-model="queryForm.routeName"
                                    size="medium"
                                    placeholder="请选择线路"
                                >
                                    <el-option
                                        v-for="routeName in routeList"
                                        :key="routeName"
                                        :label="routeName"
                                        :value="routeName"
                                    ></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="方向">
                            <el-col :span="20">
                                <el-select
                                    filterabl
                                    v-model="queryForm.starttag"
                                    size="medium"
                                    placeholder="请选择线路"
                                >
                                    <el-option label="上行" value="0"></el-option>
                                    <el-option label="下行" value="1"></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                    </el-form>

                    
                    <el-row>
                        <el-col>
                            <el-button
                                type="primary"
                                size="small"
                                @click="query"
                            >查询</el-button>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </el-collapse>
        </div>

        <div class="mark-form-panel">
            <el-collapse>
                <el-collapse-item title="mark面版">

                    <el-form
                        class="query-form-box"
                        ref="form"
                        :model="inputForm"
                        label-width="80px"
                    >
                        <el-form-item label="经度">
                            <el-col :span="20">
                                <el-input placeholder="请输入内容"  v-model="inputForm.longitude" clearable></el-input>                                
                            </el-col>
                        </el-form-item>

                        <el-form-item label="纬度">
                            <el-col :span="20">
                                <el-input placeholder="请输入内容"  v-model="inputForm.latitude" clearable></el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>

                    <el-row>
                        <el-col>
                            <el-button
                                type="primary"
                                size="small"
                                @click="addMark"
                            >添加点</el-button>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
  import {getRouteMsg} from '@/api/gpsApi'
  import {gps84_To_Gcj02} from '@/common/js/gps.js'
  import axios from 'axios'
  import {REQ_SUCCESS,isEnableTiming} from '@/api/APIConstans'
  import { AMapManager } from 'vue-amap';
  let amapManager = new AMapManager();

  export default {
    name:"locusMap",
    data(){
      return {
        wrapperHeight:650,
        fullscreenLoading:false,
        queryForm:{
          routeName:'',
          starttag:''
        },
        inputForm:{
            longitude:'',
            latitude:''
        },
        routeList:[],
        zoom: 12,
        center: [112.998758,28.182349],
        amapManager,
        events: {
            init:this.initPathSimplifierIns
        },
        map:{},
        markerList:[],
        amapMarkerList:[],
        reportSiteMark:{}
      }
    },
    created(){
      this.getRouteNames();
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
                }
            });
        },
        initPathSimplifierIns(map){
            this.map = map;
            //给地图添加点击事件
            this.map.on('click',this.mapClick);
            //加载UI
            let __this = this;
            AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
                __this.reportSiteMark = new SimpleMarker({
                    iconLabel: {
                        innerHTML: '<i>报站</i>', //设置文字内容
                        style: {
                            color: '#fff' //设置文字颜色
                        }
                    },
                    iconStyle: 'red',
                    map: map
                });
            });
        },
        mapClick(ev){
            let lnglat = ev.lnglat;
            // let marker = new AMap.Marker({
            //     position: new AMap.LngLat(lnglat.lng, lnglat.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            //     title: '北京'
            // });

            // // 将创建的点标记添加到已有的地图实例：
            // this.map.add(marker);
        },
        addMark(){

        },
        elementMarkHandler(list){
            let marks = [];
            list.forEach(ele => {
                marks.push({
                    position:[ele.longitude, ele.latitude],
                    events:{
                        click:() => {
                            alert(ele.siteName)
                        },
                    },
                    visible:true
                });
            });
            this.markerList = marks;
        },
        amapMarkerHandler(list){
            let index = 1;
            list.forEach(ele => {
                // let lnglats = gps84_To_Gcj02(ele.latitude,ele.longitude);
                let lnglats = [ele.longitude,ele.latitude];
                let marker = new AMap.Marker({
                    position: new AMap.LngLat(lnglats[0], lnglats[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    title: '北京'
                });
                // ele.siteName = index;
                marker.setLabel({
                    offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
                    content: "<div class='info'>" + ele.siteName + "</div>", //设置文本标注内容
                    direction: 'right' //设置文本标注方位
                });
                index++;
                this.map.add(marker);
            })

            this.reportSiteMark.setPosition([113.135691, 28.175375]);
            
        },
        query(){
            let params = {
                ...this.queryForm
            };
            this.map.remove(this.markerList);
            axios.get("http://124.71.35.135:8282/device/gps/site/route",{params})
            // axios.get("http://dispatch.bus68.cn/workplan/route/fenceData",{params})
            .then(resp => {
                // this.elementMarkHandler(resp.data.result)
                this.amapMarkerHandler(resp.data.result);
            });
        },
        getRouteNames(){
            axios.get("http://124.71.35.135:8282/device/base/data/routeNames",{})
            .then(resp => {
                console.log(resp);
                this.routeList = resp.data.result;
                this.queryForm.routeName = this.routeList[0];
            });
        }
    }
  }
</script>

<style scoped>
.wrap-map {
    position: relative;
    width: 100%;
    height: 100%;
}
.amap-demo {
    height: 400px;
    width: 100%;
}
.map-vehicle {
    display: block;
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 6px;
}
.map-vehicle-normal {
    background-color: #67c23a;
    border-color: #67c23a;
    border: 1px solid #67c23a;
}
.map-vehicle-level {
    background-color: #409eff;
    border-color: #409eff;
    border: 1px solid #409eff;
}
.map-vehicle-danger {
    background-color: #fa5555;
    border-color: #fa5555;
    border: 1px solid #fa5555;
}
.map-vehicle em {
    position: absolute;
    font-style: normal;
    font-size: 14px;
    left: -7px;
    top: 10px;
}
.query-form-panel {
    position: absolute;
    left: 20px;
    top: 0;
    background: #fff;
    width: 350px;
}

.mark-form-panel {
    position: absolute;
    right: 20px;
    top: 0;
    background: #fff;
    width: 350px;
}

.running-info-panel {
    position: absolute;
    right: 20px;
    top: 0;
    background: #fff;
    width: 350px;
    height: 49px;
    line-height: 49px;
}
</style>