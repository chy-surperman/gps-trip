<template>
  <div class="wrap-map">
    <el-row style="margin-bottom:15px;" :gutter="20">
      <el-col :span="4">
        <el-date-picker
          size="mini"
          v-model="queryWorkplan.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-select filterable @change="routeChange" v-model="queryWorkplan.routeName" size="mini" placeholder="请选择线路">
          <el-option v-for="routeName in routeList" :key="routeName"
                     :label="routeName" :value="routeName"></el-option>
        </el-select>
      </el-col>

      <!-- <el-col :span="3">
          <el-select placeholder="请选择方向" v-model="queryWorkplan.starttag" size="mini">
              <el-option label="上行" value="0"></el-option>
              <el-option label="下行" value="1"></el-option>
          </el-select>
      </el-col> -->
      <el-col :span="3">
        <el-checkbox v-model="isQueryAll">是否查询所有车辆和司机</el-checkbox>
      </el-col>
      <el-col :span="3">
        <el-select filterable clearable placeholder="请选择驾驶员" v-model="queryWorkplan.driverId" size="mini">
          <el-option
            v-for="item in drivers"
            :key="item.driverId"
            :label="item.driverName"
            :value="item.driverId">
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="3">
        <el-select filterable clearable placeholder="请选择车辆" v-model="queryWorkplan.vehicleId" size="mini">
          <el-option
            v-for="item in vehicles"
            :key="item.vehicleId"
            :label="item.selfNum"
            :value="item.vehicleId">
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="2" :offset="1">
        <el-button size="mini" type="primary" @click="queryNotArrive">查询</el-button>
      </el-col>

      <el-col :span="2" :offset="1">
        <el-button size="mini" type="primary" @click="addTrip">添加自定义趟次</el-button>
      </el-col>
    </el-row>
    <p>
      <span>上行运行时长：</span><span v-text="lineRunTime.up"></span>
      <span>下行运行时长：</span><span v-text="lineRunTime.down"></span>

      <span>到达时间：</span><span v-text="lineRunTime.arrival"></span>
    </p>
    <el-row>
      <!--排班数据-->
      <el-col :span="13">
        <el-table :data="departureData" border size="mini" :max-height="height" id="departureData"
                  @cell-dblclick="editRow"
                  @selection-change="selectRow"
                  :height="height" align="center" style="width: 100%">
          <el-table-column align="center" header-align="center" prop="driverName" label="司机姓名" width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit" v-text="scope.row.driverName"></span>
              <el-select filterable v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.driverId" size="mini">
                <el-option
                  v-for="item in drivers"
                  :key="item.driverId"
                  :label="item.driverName"
                  :value="item.driverId">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" header-align="center" prop="selfNum" label="车号" width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit" v-text="scope.row.selfNum"></span>
              <el-select filterable v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.vehicleId" size="mini">
                <el-option
                  v-for="item in vehicles"
                  :key="item.vehicleId"
                  :label="item.selfNum"
                  :value="item.vehicleId">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <!--:render-header="renderDirection"-->
          <el-table-column align="center" header-align="center" prop="direction" label="方向" width="90">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit" v-text="scope.row.direction"></span>
              <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.starttag" size="mini">
                <el-option label="上行" value="0"></el-option>
                <el-option label="下行" value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <!--:render-header="renderDirection"-->
          <el-table-column align="center" header-align="center" prop="createNewGps" label="重建GPS" width="90">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit" v-text="scope.row.createNewGps"></span>
              <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.createNewGps" size="mini">
                <el-option label="不重新生成" value="0"></el-option>
                <el-option label="重新生成" value="1"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" header-align="center" prop="departureMinute" label="发车时间" width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit" v-text="scope.row.departureMinute"></span>
              <timeInputComponent v-if="scope.row.isEdit" width="40" @time="departureMinuteChange(scope.row,arguments)"
                                  :time="scope.row.departureMinute"
                                  v-model="scope.row.departureMinute"></timeInputComponent>
            </template>
          </el-table-column>

          <el-table-column align="center" header-align="center" prop="arrivalMinute" label="到达时间" width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit" v-text="scope.row.arrivalMinute"></span>
              <timeInputComponent v-if="scope.row.isEdit" width="40" :time="scope.row.arrivalMinute"
                                  v-model="scope.row.arrivalMinute"></timeInputComponent>

            </template>
          </el-table-column>

          <el-table-column align="center" header-align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="success" v-if="scope.row.isEdit" size="mini" @click="queryLocus(scope.row)">查询
              </el-button>
              <el-button type="info" v-if="scope.row.isEdit" size="mini" @click="deleteData(scope.$index,scope.row)">
                取消
              </el-button>
              <el-button v-show="!scope.row.isEdit" type="primary" size="mini" icon="el-icon-edit"
                         @click="editWorkplan(scope.row)"></el-button>

              <el-button v-show="!scope.row.isEdit" type="danger" size="mini" icon="el-icon-delete"
                         @click="cancelPlanSchedule(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!--地图-->
      <el-col :span="11">
        <workplan-locus ref="workplanLocus" v-on:addWorkplan="saveWorkplan"></workplan-locus>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {
  getRouteMsg, getGpsVehicles, getGpsDrivers, getConditionWorkplans,
  addWorkplanGps, cancelManulAddWorkplan, getRouteRunTime
} from '@/api/gpsApi'
import {REQ_SUCCESS, isEnableTiming} from '@/api/APIConstans'
import workplanLocus from '@/components/workplanLocus.vue'
import timeInputComponent from '@/components/timeInputComponent'
import {formatDate} from '@/common/js/dateFmt'

export default {
  name: "departureWorkplan",
  components: {
    workplanLocus,
    timeInputComponent
  },
  data() {
    return {
      date: '',
      routeName: '',
      isQueryAll: true,
      queryDate: '',
      addModel: 'arrived',
      lineRunTime: {
        up: 0,
        down: 0,
        arrival: 0,
      },
      wpLocusQuery: {
        startTime: '',
        endTime: '',
        vehicleId: ''
      },
      queryWorkplan: {
        date: '',
        starttag: '0',
        // status:'1',
        routeName: '',
        vehicleId: '',
        driverId: ''
      },
      departureData: [],
      routeList: [],
      vehicles: [],
      drivers: [],
      height: 500,
      cancelWorkplan: null,
    }
  },
  mounted() {
    let __this = this;
    document.onkeydown = function (e) {
      if (e.keyCode == 13) {
        __this.saveWorkplan();
      }
    }
  },
  created() {
    this._getRouteMsg();
    if (this.isQueryAll) {
      this._getVehicle();
      this._getDriver();
    }
    this.queryWorkplan.date = formatDate(new Date(), 'yyyy-MM-dd');
  },
  methods: {
    selectRow(selection) {
      this.selection = selection;
    },
    routeChange(val) {
      this.routeName = val;
      this._getRouteRunTime();
      if (this.isQueryAll) {
        if (this.vehicles.length < 200) {
          this._getVehicle();
        }
        if (this.drivers.length < 200) {
          this._getDriver();
        }
      }
    },
    _getRouteMsg() {
      getRouteMsg().then(resp => {
        console.log(resp)
        if (resp.code == REQ_SUCCESS) {
          this.routeList = resp.result;
        }
      });
    },
    _getRouteRunTime() {
      let params = {routeName: this.routeName}
      getRouteRunTime(params).then(resp => {
        if (resp.code == REQ_SUCCESS) {
          this.lineRunTime.up = resp.result.up;
          this.lineRunTime.down = resp.result.down;
        }
      });
    },
    _getRunningVehicle() {
      let params = {
        ...this.queryWorkplan
      };
      params.routeName = this.routeName;
      getConditionWorkplans(params).then(resp => {
        if (resp.code == REQ_SUCCESS) {
          this.departureData = this.handlerFixedWorkplans(resp.result)
        }
      });
    },
    _getVehicle() {
      let param = {};
      if (!this.isQueryAll) {
        param.routeName = this.routeName;
      }
      getGpsVehicles(param).then(resp => {
        console.log(resp)
        if (resp.code == REQ_SUCCESS) {
          this.vehicles = resp.result;
        }
      })
    },
    _getDriver() {
      let param = {};
      if (!this.isQueryAll) {
        param.routeName = this.routeName;
      }
      getGpsDrivers(param).then(resp => {
        if (resp.code == REQ_SUCCESS) {
          this.drivers = resp.result
        }
      });
    },
    handlerFixedWorkplans(data) {
      if (null == data || data.length == 0) {
        this.$message.info("无未到达排班");
        return [];
      }
      for (let i = 0; i < data.length; i++) {
        data[i] = this.handlerWorkplanEle(data[i]);
      }
      return data;
    },
    handlerWorkplanEle(ele) {

      let departureMinute = formatDate(new Date(ele.departureTime), "hh:mm");
      let timeArray = departureMinute.split(":");

      ele.depHour = timeArray[0];
      ele.depMinute = timeArray[1];
      ele.departureMinute = departureMinute;
      if (null == ele.driverId || null == ele.vehicleId) {
        ele.isEdit = false;
      } else {
        ele.isEdit = false;
      }
      ele.model = "edit";
      ele.createNewGps = "1";
      ele.direction = ele.starttag == '0' ? '上' : '下';

      if (null == ele.arrivalString || ele.arrivalString == '') {
        ele.arrHour = '';
        ele.arrMinute = '';
        ele.arrivalMinute = ''
      } else {
        ele.arrivalMinute = formatDate(new Date(ele.arrivalTime), "hh:mm");
        let arrivalTimeArray = ele.arrivalString.split(":");
        ele.arrHour = arrivalTimeArray[0];
        ele.arrMinute = arrivalTimeArray[1];
      }

      ele.reasonType = '';
      ele.reasonDetail = '';
      return ele;
    },
    queryNotArrive() {
      if (null == this.queryWorkplan.date || '' == this.queryWorkplan.date) {
        this.$message.error("请先选择日期");
        return;
      }
      if (null == this.queryWorkplan.starttag || '' == this.queryWorkplan.starttag) {
        this.$message.error("请先选择方向");
        return;
      }
      this._getRunningVehicle();
    },
    queryLocus(row) {
      let wpLocusQuery = {
        startDate: this.queryWorkplan.date + " " + row.departureMinute + ":00",
        endDate: this.queryWorkplan.date + " " + row.arrivalMinute + ":00",
        vehicleId: row.vehicleId,
        starttag: row.starttag,
        routeName: this.routeName
      }

      this.$refs.workplanLocus.query(wpLocusQuery);

    },
    deleteData(index, row) {
      if (row.model == 'add') {
        this.departureData.splice(index, 1);
      } else {
        this._getRunningVehicle();
      }
      // this.deleteCreateGps(this.queryWorkplan.date)
    },
    editWorkplan(row) {
      row.model = "edit";
      row.isEdit = true;
    },
    addTrip(index) {
      if (null == this.queryWorkplan.date || '' == this.queryWorkplan.date) {
        this.$message.error("请先选择日期");
        return;
      }
      let plan = {
        selfNum: '',
        reasonType: '',
        reasonDetail: '',
        driverId: this.queryWorkplan.driverId,
        driverName: '',
        vehicleId: this.queryWorkplan.vehicleId,
        scheduleMinute: '',
        direction: '',
        starttag: "0",
        createNewGps: "1",
        trip: '',
        depHour: '',
        depMinute: '',
        arrHour: '',
        arrMinute: '',
        model: "add",
        isEdit: true
      };
      this.departureData.splice(index + 1, 0, plan);
    },
    editRow(row, column, cell, event) {
      row.isEdit = true;
    },
    cancelPlanSchedule(index) {
      this.$confirm('此操作将永久排班, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let row = this.departureData[index];
        let params = {
          id: row.id
        };
        cancelManulAddWorkplan(params).then(resp => {
          if (resp.code == REQ_SUCCESS) {
            this._getRunningVehicle();
          } else {
            this.$message.error(resp.define);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    saveWorkplan(obj) {
      let index = this.departureData.findIndex(ele => ele.isEdit == true);
      if (index == -1) {
        return this.$message.info("没有正在编辑的趟次");
      }

      let row = this.departureData[index];
      let params = {
        reasonType: row.reasonType,
        reasonDetail: row.reasonDetail,
        associationWorkplan: {
          id: row.id,
          dateString: this.queryWorkplan.date,
          departureString: row.departureMinute + ":00",
          arrivalString: row.arrivalMinute + ":00",
          routeName: this.routeName,
          starttag: row.starttag,
          driverId: row.driverId,
          vehicleId: row.vehicleId,
          createNewGps: row.createNewGps
        }
      }

      addWorkplanGps(params).then(resp => {
        if (resp.code == REQ_SUCCESS) {
          this._getRunningVehicle();
        } else {
          this.$message.error(resp.define);
        }
      })
    },
    deleteCreateGps(date) {
      let sign = sessionStorage.getItem("workplan.gpsSign");
      if (!sign) {
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let param = {date, sign}
      cancelWorkplanGps(param).then(resp => {
        if (resp.code == REQ_SUCCESS) {
          loading.close();
        } else {
          loading.close();
        }
      })
    },
    departureMinuteChange(row, arg) {
      let runtime = row.starttag == '0' ? this.lineRunTime.up : this.lineRunTime.down;

      let departure = arg[0];
      if (!departure || departure.indexOf(":") == -1) {
        return;
      }
      let time = departure.split(":");
      let hour = parseInt(time[0]);
      let minute = parseInt(time[1]) + runtime;

      hour = hour + parseInt(minute / 60);
      minute = minute % 60;

      hour = parseInt(hour) < 10 ? ('0' + parseInt(hour)) : hour;
      minute = parseInt(minute) < 10 ? ('0' + parseInt(minute)) : minute;
      this.lineRunTime.arrival = hour + ":" + minute;

    }
  },
}
</script>

<style scoped>
.wrap-map {
  position: relative;
  margin-top: 15px;
  width: 100%;
  height: 100%;
}

.departure__header {
  padding: 0;
  position: relative;
  margin: 0 0 15px;
}

.table__footer_op {
  height: 35px;
  line-height: 35px;
  width: 30%;
  position: absolute;
  right: 0;
  z-index: 1001;
}

.box-card-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.dispatch-dropdown-text {
  color: #909399;
  font-size: 12px;
  cursor: pointer;
}

.time-input-box input {
  width: 40px;
  height: 28px;
  line-height: 28px;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  display: inline-block;
  font-size: inherit;
  outline: none;
  padding: 0 8px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
}

.time-input-box input:focus {
  outline: none;
  border-color: #409eff;
}

.time-input-box span {
  font-weight: 700;
}

.schedule-wrap {
  height: 99%;
  background: #fff;
}

.query-panel {
  margin: 15px;
}
</style>
