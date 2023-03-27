<template>
	<el-dialog title="添加里程" :visible.sync="dialogVisible" @close="closeDialog">
		<el-form ref="mileageForm" :rules="mileageRules" :inline="true" :model="mileageForm" label-width="100px">
			
				<el-form-item label="起始日期" prop="startTime">
			      	<el-date-picker
				      	v-model="mileageForm.startTime"
				      	type="date"
				      	format="yyyy-MM-dd"
				      	placeholder="选择日期">
					</el-date-picker>
			    </el-form-item>

			    <el-form-item label="结束日期" prop="endTime">
			      	<el-date-picker
				      	v-model="mileageForm.endTime"
				      	type="date"
				      	format="yyyy-MM-dd"
				      	placeholder="选择日期">
					</el-date-picker>
			    </el-form-item>

			    <el-form-item label="车辆编号" prop="selfNum">
				    <el-input v-model.trim="mileageForm.selfNum"></el-input>
				</el-form-item>
				<el-form-item label="车牌号" prop="plateNum">
				    <el-input v-model.trim="mileageForm.plateNum"></el-input>
				</el-form-item>

			    <el-form-item label="营运里程" prop="operationMileage">
				    <el-input v-model.trim="mileageForm.operationMileage"></el-input>
				</el-form-item>
				<el-form-item label="合计里程" prop="mileageTotal">
				    <el-input v-model.trim="mileageForm.mileageTotal"></el-input>
				</el-form-item>
				<el-form-item label="非营运里程" prop="notOperationMileage">
				    <el-input v-model.trim="mileageForm.notOperationMileage"></el-input>
				</el-form-item>
				<el-form-item label="总趟次" prop="tripCount">
				    <el-input v-model.trim="mileageForm.tripCount"></el-input>
				</el-form-item>
				<el-form-item label="线路" prop="routeName">
					<el-select  v-model="mileageForm.routeName" placeholder="请选择线路">
				   		<el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
			    	</el-select>
				</el-form-item>
				<el-form-item label="单位名称" prop="unit">
				    <el-input v-model.trim="mileageForm.unit"></el-input>
				</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
		    <el-button @click="closeDialog">取 消</el-button>
		    <el-button type="primary" @click="saveMileage('mileageForm')">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {getRouteMsg,addVehicleMileage,updateVehicleMileage} from '@/api/gpsApi'
	import {formatDate} from '@/common/js/dateFmt.js'
	import {REQ_SUCCESS,isEnableTiming} from '@/api/APIConstans'
	export default{
		props:["showMileageDialog","mileage"],
		data(){
			return {
				mileageForm:{
					id:'',
					startTime:'',
					endTime:'',
					startDate:'',
					endDate:'',
					selfNum:'',
					plateNum:'',
					mileageTotal:'',
					operationMileage:'',
					notOperationMileage:'',
					tripCount:'',
					unit:'',
					routeName:''
				},
				routeList:[],
				mileageRules:{
					startTime: [
			            { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
			        ],
			        endTime: [
			            { type: 'date', required: true, message: '请选择结束日期', trigger: 'change' }
			        ],
			        selfNum: [
			        	{ required: true, message: '请输入车辆编号', trigger: 'blur' }
			        ],
			        plateNum: [
			        	{ required: true, message: '请输入车牌号', trigger: 'blur' }
			        ],
			        operationMileage: [
			        	{ required: true, message: '请输入营运里程', trigger: 'blur' }
			        ],
			        notOperationMileage: [
			        	{ required: true, message: '请输入非营运里程', trigger: 'blur' }
			        ],
			        tripCount: [
			        	{ required: true, message: '请输入总趟次', trigger: 'blur' }
			        ],
			        mileageTotal:[
			        	{ required: true, message: '请输入合计里程', trigger: 'blur' }
			        ],
			        unit:[
			        	{ required: true, message: '请输入单位名称', trigger: 'blur' }
			        ],
			        routeName:[
			            { required: true, message: '请选择线路', trigger: 'change' }
			        ]
				},
				dialogVisible:false
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
			closeDialog(){
            	this.$emit('closeDialog');
            },
			saveMileage(formName){
				this.$refs[formName].validate((valid) => {
			        if (valid) {
			        	
			        	this.mileageForm.startDate = formatDate(this.mileageForm.startTime,"yyyy-MM-dd");
			            this.mileageForm.endDate = formatDate(this.mileageForm.endTime,"yyyy-MM-dd");

			            if(null == this.mileageForm.id || this.mileageForm.id == ''){
			            	addVehicleMileage(this.mileageForm).then(resp => {
			            		if(resp.code == REQ_SUCCESS){
									this.$message.success("保存成功");
									this.$emit('closeDialog','success');
								}else{
									this.$message.error(resp.define)
								}
			            	});
			            }else{
			            	updateVehicleMileage(this.mileageForm).then(resp => {
			            		
			            		if(resp.code == REQ_SUCCESS){
									this.$message.success("保存成功");
									this.$emit('closeDialog','success');
								}else{
									this.$message.error(resp.define)
								}
			            	});
			            }
			        } else {
			            console.log('error submit!!');
			            return false;
			        }
		        });
			}
		},
		watch:{
          	showMileageDialog(newValue){
              	this.dialogVisible = newValue;
              	this.mileageForm = {
					id:'',
					startTime:'',
					endTime:'',
					startDate:'',
					endDate:'',
					selfNum:'',
					plateNum:'',
					mileageTotal:'',
					operationMileage:'',
					notOperationMileage:'',
					tripCount:'',
					unit:'',
					routeName:''
				};
              	this._getRouteLis();
          	},
          	mileage(newValue){
          		this.mileageForm = newValue;
          		if(null != newValue){
          			let arr = this.mileageForm.startDate.split("-");
	         		this.mileageForm.startTime = new Date(parseInt(arr[0]),parseInt(arr[1]) - 1,parseInt(arr[2]));

	         		let end = this.mileageForm.endDate.split("-");
	         		this.mileageForm.endTime = new Date(parseInt(end[0]),parseInt(end[1]) - 1,parseInt(end[2]));
          		}
         		
          	}
        }
	}
</script>

<style scoped>
	
</style>