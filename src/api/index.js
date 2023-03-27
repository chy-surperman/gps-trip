import Vue from 'vue'
import axios from 'axios'
import { baseURL,REQ_NOT_LOGIN } from './APIConstans'
import router from '../router'


var instance = axios.create({
  	baseURL: baseURL,
  	timeout: 30000
});

//添加一个响应拦截器
instance.interceptors.response.use(function(response){
	//在这里对返回的数据进行处理
	let request = response.request;
	if(request.responseURL.lastIndexOf("user/login") == -1){
		if(response.data.code == REQ_NOT_LOGIN){
			router.push('/login')
		}
	}
	return response;
  },function(err){
	//Do something with response error
	return Promise.reject(err);
  });

export const api = {
	get(url,params){
		return new Promise((resolve,reject) => {
			instance.defaults.headers.Authorization = sessionStorage.getItem("loginInfo.gpsUserId");
			instance.get(url,{params:params})
			.then((response) => {
				resolve(response.data)
			})
			.catch((error) => {
				reject(error)
			})
		})
	},
	post(url,params){
		return new Promise((resolve,reject) => {
			instance.defaults.headers.Authorization = sessionStorage.getItem("loginInfo.gpsUserId");
			instance.post(url,params)
			.then((response) => {
				resolve(response.data)
			})
			.catch((error) => {
				reject(error)
			})
		})
	},
	delete(url,params){
		return new Promise((resolve,reject) => {
			instance.defaults.headers.Authorization = sessionStorage.getItem("loginInfo.gpsUserId");
			instance.delete(url,{params:params})
			.then((response) => {
				resolve(response.data)
			})
			.catch((error) => {
				reject(error)
			})
		})
	},
	put(url,body,params){
		return new Promise((resolve,reject) => {
			instance.defaults.headers.Authorization = sessionStorage.getItem("loginInfo.gpsUserId");
			instance.put(url,{params:params})
			.then((response) => {
				resolve(response.data)
			})
			.catch((error) => {
				reject(error)
			})
		})
	}
}