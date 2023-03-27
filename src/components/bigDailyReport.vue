<template>
    <div class="wrap-map">
        <el-dialog title="日报表查询" width="25%" :visible.sync="dialogFormVisible" @close="closeDialog">
            <el-form class="query-form-box" ref="form" :model="queryForm" label-width="80px">
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="queryForm.startDate"
                        type="date"
                        size="medium"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="线路">
                    <el-select
                        v-model="queryForm.routeName"
                        size="medium"
                        @change="routeChange"
                        placeholder="请选择线路"
                    >
                        <el-option
                            v-for="route in routeList"
                            :key="route"
                            :label="route"
                            :value="route"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" :loading="dialogBtnLoading" @click="query">确 定</el-button>
            </div>

        </el-dialog>

        <div class="running-info-panel">
            <el-button type="primary" size="small" @click="printReport">查询</el-button>
            <el-button type="primary" size="small" @click="exportReport">导出</el-button>
        </div>
        <div class="daily-report" id="dailyReport">
            <div class="daily-report-big-title">
                <strong v-text="reportTitle.title"></strong>
            </div>
            <div class="daily-report-desc">
                <el-col :span="1">
                    <span>车队</span>
                </el-col>
                <el-col :span="2">
                    <strong v-text="reportTitle.routeName"></strong>
                    <span>路线</span>
                </el-col>
                <el-col :span="1">
                    <span>站</span>
                </el-col>

                <el-col :span="3" :offset="16">
                    <strong v-text="reportTitle.queryDate"></strong>
                </el-col>

                <el-col :span="1">
                    <span>星期</span>
                    <strong v-text="reportTitle.queryWeek"></strong>
                </el-col>
            </div>

            <!--报表的内容-->
            <div
                class="daily-report-content"
                v-bind:style="{ width: ui.contentWidth + 'px',marginLeft: ui.contentMargin + 'px'}"
            >
                <div
                    class="item-work"
                    v-bind:style="{ width:ui.itemWidth + 'px'}"
                    v-for="(plan,index) in driverWorkplans"
                    :key="index"
                >
                    <el-row class="border-bottom">
                        <el-col :span="2" class="border-right">车号</el-col>
                        <el-col :span="11" class="height2 border-right line-height2">
                            <span v-text="plan.selfNums"></span>
                        </el-col>
                        <el-col :span="2" class="border-right">出车</el-col>
                        <el-col :span="8" class="line-height2">
                            <span v-text="plan.driverName"></span>
                        </el-col>
                    </el-row>
                    <el-row class="border-bottom">
                        <el-col :span="2" class="border-right">司乘人员</el-col>
                        <el-col :span="2" class="border-right height4 line-height2">上午</el-col>
                        <el-col :span="9" class="border-right">
                            <div class="height2 border-bottom"></div>
                            <div class="height2"></div>
                        </el-col>
                        <el-col :span="2" class="border-right height4 line-height2">上午</el-col>
                        <el-col :span="9" class>
                            <div class="height2 border-bottom"></div>
                        </el-col>
                    </el-row>
                    <el-row class="border-bottom">
                        <el-col :span="2" class="border-right">次趟</el-col>
                        <el-col :span="8" class="height2 border-right line-height2">发车时间</el-col>
                        <el-col :span="8" class="height2 border-right line-height2">到达时间</el-col>
                        <el-col :span="6" class="line-height2">备注</el-col>
                    </el-row>
                    <el-row
                        class="border-bottom tangci-height"
                        v-for="(workplan,index) in plan.workplans"
                        :key="index"
                    >
                        <el-col :span="2" class="border-right">
                            <span v-text="index + 1"></span>
                        </el-col>
                        <el-col :span="8" class="border-right height2 line-height2">
                            <span
                                v-text="workplan.departureString"
                                v-bind:class="{ isManul: workplan.departureWay != '2' }"
                            ></span>
                        </el-col>
                        <el-col :span="8" class="border-right height2 line-height2">
                            <span
                                v-text="workplan.arrivalString"
                                v-bind:class="{ isManul: workplan.arrivalWay != '2' }"
                            ></span>
                        </el-col>
                        <el-col :span="6" class="line-height2">
                            <span v-text="workplan.starttag"></span>
                        </el-col>
                    </el-row>
                </div>

                <div
                    class="item-work"
                    v-bind:style="{ height: 493 + 'px',width: 4 + 3 * ui.itemWidth + 'px', borderBottom:'1px solid #ccc'}"
                >
                    <el-row class="border-bottom dispatch-note-title">调度记事</el-row>
                    <el-row>
                        <ol style="list-style:none; text-align:left;">
                            <li :key="workNote" v-for="workNote in workplanNotes">
                                <p v-text="workNote"></p>
                            </li>
                        </ol>
                    </el-row>
                </div>
            </div>
            <div class="daily-report-desc" style="margin-bottom: 10px;">
                <el-col :span="2" :offset="15">
                    <span>签名日期</span>
                </el-col>

                <el-col :span="3">&nbsp;&nbsp;&nbsp;&nbsp;</el-col>

                <el-col :span="2">
                    <span>行车调度员</span>
                </el-col>

                <el-col :span="3"></el-col>
            </div>
        </div>
    </div>
</template>

<script>
import { getRouteMsg, bigDailyReport } from "@/api/gpsApi";
import { formatDate } from "@/common/js/dateFmt";
import html2canvas from "html2canvas";
import { REQ_SUCCESS, isEnableTiming } from "@/api/APIConstans";

export default {
    name: "bigDailyReport",
    data() {
        return {
			dialogBtnLoading:false,
			dialogFormVisible:false,
            queryForm: {
                startDate: "",
                routeName: ""
			},
			screen:{
				width:0,
				height:0,
			},
			ui:{
				itemWidth:240,
				rowItemCount:6,
				contentWidth:240*6,
				contentMargin:0,
			},
			reportTitle:{
				title:"长沙县通畅巴士调度日报表",
				routeName:'1',
				queryWeek:"三",
				queryDate:"2019-09-29",
			},
			driverWorkplans:[],
			workplanNotes:[],
            routeList: []
        };
    },
    created() {
        this._getRouteMsg();
    },
    mounted() {
        this.screen = {
			width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
		};

		let width = this.screen.width * 0.97 - 2 * this.ui.rowItemCount;

		this.ui.itemWidth = parseInt(width / this.ui.rowItemCount);
		this.ui.contentWidth = this.ui.itemWidth * this.ui.rowItemCount + 2 * this.ui.rowItemCount;
		this.ui.contentMargin = (width - this.ui.contentWidth) / 2;

		this.driverWorkplans = this.handlerResult([]);
		this.query();
		
		this.reportTitle.routeName = this.queryForm.routeName;
		this.reportTitle.queryDate = this.queryForm.startDate;
		
		let dateStr = this.reportTitle.queryDate.split("-");
		let date = new Date(parseInt(dateStr[0]), parseInt(dateStr[1]) - 1, parseInt(dateStr[2]))
		this.getWeek(date);
    },
    methods: {
        _getRouteMsg() {
            getRouteMsg().then(resp => {
                if (resp.code == REQ_SUCCESS) {
                    this.routeList = resp.result;
                    this.queryForm.routeName = this.routeList[0].routeName;
                }
            });
		},
		printReport() {
            this.dialogFormVisible = true;
		},
		routeChange(val) {
            this.queryForm.routeName = val;
        },
        closeDialog() {
            this.dialogFormVisible = false;
        },
        getWeek(date){
			switch(date.getDay()){
				case 0: {
					this.reportTitle.queryWeek = '日';
					break;
				}  
				case 1: {
					this.reportTitle.queryWeek = '一';
					break;
				} 
				case 2: {
					this.reportTitle.queryWeek = '二';
					break;
				} 
				case 3: {
					this.reportTitle.queryWeek = '三';
					break;
				} 
				case 4: {
					this.reportTitle.queryWeek = '四';
					break;
				} 
				case 5: {
					this.reportTitle.queryWeek = '五';
					break;
				} 
				case 6: {
					this.reportTitle.queryWeek = '六';
					break;
				} 
			};
		},
        query() {
			this.reportTitle.routeName = this.queryForm.routeName;
			this.reportTitle.queryDate = this.queryForm.startDate;

			let dateStr = this.reportTitle.queryDate.split("-");
			let date = new Date(parseInt(dateStr[0]), parseInt(dateStr[1]) - 1, parseInt(dateStr[2]))
			this.getWeek(date);

            this.dialogBtnLoading = true;
            bigDailyReport(this.queryForm).then(res => {
                this.dialogBtnLoading = false;
                this.dialogFormVisible = false;

                if (res.code == REQ_SUCCESS) {
                    this.driverWorkplans = this.handlerResult(res.result.datas);
					
					//处理title
					this.reportTitle.title = "调度日报表";
					if(res.result.company){
						this.reportTitle.title = res.result.company + "调度日报表";
					}
                }
            });
        },
        handlerResult(result){
			//添加空得排班，凑够10个
			let index = result.findIndex(e => e.workplans.length > 10);
			let maxLength = index < 0?10:result[index].workplans.length;
			maxLength = 14;
			
			result.forEach(e => {
				this.addEmptyWorkplan(maxLength - e.workplans.length,e.workplans);
			});

			//填满屏幕
			let addCount = 0;
			let totalCount = result.length + 3;
			
			if(totalCount > 3 * this.ui.rowItemCount){
				addCount = this.ui.rowItemCount - (totalCount % this.ui.rowItemCount);
			}else{
				addCount = 3 * this.ui.rowItemCount - totalCount;
			}

			for(let i = 0; i < addCount; i++){
				let ele = {
					selfNums:'',
					driverName:'',
					workplans:this.addEmptyWorkplan(maxLength,[])
				}
				result.push(ele);
			}
			return result;
		},
		addEmptyWorkplan(count,workplans){
			for(let i = 0; i < count; i++){
				let workplan = {
					count:i,
					departureString:'',
					arrivalString:'',
					starttagStr:""
				}
				workplans.push(workplan);
			}
			return workplans;
        },
        exportReport(){
            const targetDom = document.querySelector("#dailyReport");
            let fileName = this.queryForm.startDate + "_" + this.queryForm.routeName + ".jpg";
            html2canvas(targetDom,{
                allowTaint: false,
                useCORS: true,
                height: targetDom.scrollHeight,
                width: targetDom.scrollWidth
            }).then(canvas => {
                canvas.style.width = parseFloat(canvas.style.width) + 'px'
                canvas.style.height = parseFloat(canvas.style.height) + 'px'
                setTimeout(() => {
                    // toImage
                    const dataImg = new Image()
                    dataImg.src = canvas.toDataURL('image/png')
                    document.querySelector('#dailyReport').appendChild(dataImg)

                    const alink = document.createElement("a");
                    alink.href = dataImg.src;
                    alink.download = fileName;
                    alink.click();
                    document.querySelector('#dailyReport').removeChild(dataImg)
                }, 0)
            });
        }
    }
};
</script>

<style scoped>
.wrap-map {
    position: relative;
    width: 100%;
    height: auto;
    background: #fff;
}

.query-form-panel {
    position: absolute;
    z-index: 1001;
    left: 20px;
    top: 0;
    background: #fff;
    width: 350px;
}
.query-collapse {
    background: #eee;
}
.running-info-panel {
    position: absolute;
    right: 20px;
    z-index: 1001;
    top: 0;
    background: #fff;
    width: 250px;
    height: 49px;
    line-height: 49px;
}
.daily-report {
    width: 97%;
    margin: 2px auto;
    height: auto;
}
.daily-report-big-title {
    width: 30%;
    margin: 10px auto;
    text-align: center;
    font-size: 25px;
}
.daily-report-desc {
    width: 80%;
    margin: 10px auto;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
}
.daily-report-content {
    height: auto;
    font-size: 13px;
    margin: 5px auto;
    text-align: center;
}
.item-work {
    float: left;
    line-height: 14px;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
}
.tangci-height {
    height: 27.2px;
    line-height: 27.2px;
}
.height2 {
    height: 27.2px;
}
.height4 {
    height: 54.4px;
}
.line-height2 {
    line-height: 27.2px;
}
.line-height4 {
    line-height: 54.4px;
}
.border-right {
    border-right: 1px solid #ccc;
}
.border-bottom {
    border-bottom: 1px solid #ccc;
}
.isManul {
    color: black;
}
.dispatch-note-title {
    height: 28.2px;
    line-height: 28.2px;
    font-weight: 700;
}
</style>