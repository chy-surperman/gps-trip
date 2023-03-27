<template>
	<div class="wrap" :style="{ height: wrapperHeight + 'px' }">
		<div class="header">
			<i class="logo el-icon-datacenter-track-line-fill"></i>
			<span>泓原通公交系统</span>
		</div>
		<div class="login-panel">
			<el-row>
				<el-col :span="20">
					<el-card class="box-card">
					  	<div slot="header" class="clearfix">
					    	<span>泓原通公交系统</span>
					  	</div>
					 	<el-form :model="loginForm" label-width="60px" class="demo-ruleForm">
							<el-form-item label="用户名">
							    <el-input type="text" v-model.trim="loginForm.userName" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="密码">
							    <el-input type="password" v-model.trim="loginForm.password" auto-complete="off"></el-input>
							</el-form-item>
							
							<div class="form__footer">
								<el-button type="primary" style="width:90%;" @click="postUser"  v-loading.fullscreen.lock="fullscreenLoading" round>登录</el-button>
				            </div>
						</el-form>
					</el-card>
					
				</el-col>
			</el-row>
		</div>
		<div class="footer">
			<p>
				@2019 长沙泓原通信息科技有限公司
				<a target="_blank" href="http://www.beian.miit.gov.cn/" style="color: white;">湘ICP备16014104号-1</a>
			</p>
		</div>
	</div>
</template>
<script>
	import {loginUser} from '@/api/gpsApi'
	import {REQ_SUCCESS,isEnableTiming} from '@/api/APIConstans'

	export default{
		name:"login",
		data(){
			return {
				wrapperHeight:700,
				loginForm:{
					userName:'',
					password:''
				},
				fullscreenLoading:false,
				value:null,
				
			}
		},
		methods:{
			handleChange(value){
				console.log(value)
			},
			postUser(){
				if(this.loginForm.userName.length == 0){
					this.$message.error("请输入用户名");
					return false;
				}
				if(this.loginForm.password.length == 0){
					this.$message.error("请输入密码");
					return false;
				}
				this._adminLogin();
			},
			_adminLogin(){
				this.fullscreenLoading = true;
				loginUser(this.loginForm).then(resp => {
					if(resp.code == REQ_SUCCESS){
						sessionStorage.setItem("loginInfo.gpsUserId",resp.result.userName);
						let _this = this;
						let timeOut = setTimeout(() => {  
							_this.fullscreenLoading = false;
			                _this.$router.push("/supplement");
			            }, 500);
					}else{
						this.fullscreenLoading = false;
						this.$message.error(resp.define);
					}
				});
			}
		},
	    mounted(){
	      	let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	      	this.wrapperHeight = height;
	    }
	}
</script>
<style scoped>
	.wrap{
		background-color: #1F2325;
	    background-image: url('https://gw.alicdn.com/tfs/TB1ittHRFXXXXcSXFXXXXXXXXXX-2880-1280.jpg');
	    background-size: cover;
	}
	.header{
	    height: 60px;
	    position: relative;
	    border-bottom: 1px solid rgba(255,255,255,0.3);
	}
	.header .logo{
		display: block;
		font-size: 50px;
		margin: 5px 15px 5px 50px;
		float: left;
		color: #fff;
	}
	.header span{
		display: block;
		float: left;
		color: #fff;
		font-size: 25px;
		line-height: 60px;
	}
	.login-panel{
		width: 500px;
		margin: 5% auto;
		height: 320px;
	}
	.footer{
		position: absolute;
		bottom: 0;
		left: 30%;
		width: 600px;
		color: #fff;
		margin: 0 auto;
		text-align: center;
	}
</style>