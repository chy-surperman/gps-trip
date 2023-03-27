import { api } from './index'

//查询所有线路
export function getRouteMsg(){
	const url = '/data/routes';
	return api.get(url, {})
}

export function getRouteRunTime(param){
	const url = '/workplan/runtime'
	return api.get(url,param)
}

export function getGpsData(param){
	const url = '/template/supplement'
	return api.post(url,param)
}

export function saveMeta(param){
	const url = '/template/saveMeta'
	return api.post(url,param)
}

export function loginUser(param){
	const url = '/user/login'
	return api.post(url,param)
}

//查询所有线路
export function getSupplementMetas(param){
	const url = '/template/getSupplementMetas'
	return api.get(url, param)
}

export function addVehicleMileage(param){
	const url = '/vehicleMileage/add'
	return api.post(url, param)
}

export function updateVehicleMileage(param){
	const url = '/vehicleMileage/update'
	return api.post(url, param)
}

export function getVehicleMileage(param){
	const url = '/report/vehicle/Mileage'
	return api.get(url, param)
}

export function deleteVehicleMileage(param){
	const url = '/vehicleMileage/delete'
	return api.get(url, param)
}

export function bigDailyReport(param){
	const url = '/data/daily/big'
	return api.get(url, param)
}

export function getGpsVehicles(param){
	const url = '/data/vehicles'
	return api.get(url, param)
}

export function getGpsDrivers(param){
	const url = '/data/drivers'
	return api.get(url, param)
}

export function getDynamicVehicles(param){
	const url = '/data/dynamicVehicles'
	return api.get(url, param)
}

export function getGpsTrack(param){
	const url = '/location/locus'
	return api.get(url, param)
}


export function getDriverVehicleTrip(param){
	const url = '/report/driverVehicle/trip'
	return api.get(url, param)
}

export function getDriverTrips(param) {
	const url = '/report/driver/trip'
	return api.get(url, param)
}

export function getVehicleTrip(param){
	const url = '/report/vehicle/trip'
	return api.get(url, param)
}

export function getWorplanGps(param){
	const url = '/workplan/gps/track'
	return api.get(url, param)
}

export function getMetaRoutenames(){
	const url = '/locu/route/name'
	return api.get(url);
}

export function getMetadatas(param){
	const url = '/locu/route/locus'
	return api.get(url,param);
}

export function getLocusMetaGpsTemplate(param){
	const url = '/locu/route/gps'
	return api.get(url,param);
}

export function queryMileage(param){
	const url = '/mileage/query'
	return api.get(url,param);
}

export function getConditionWorkplans(param){
	const url = '/workplan/query'
	return api.get(url,param);
}

export function getWorkplanGps(param){
	const url = '/workplan/gps'
	return api.get(url, param)
}

export function generterWorkplanGps(param){
	const url = '/workplan/generterGps'
	return api.get(url, param)
}

export function cancelWorkplanGps(param){
	const url = '/workplan/cancelGps'
	return api.get(url, param)
}

export function addWorkplanGps(param){
	const url = '/workplan/submitWorkplan'
	return api.post(url, param)
}


export function submitWorkplanSave(param){
  const url = '/workplan/submitWorkplanSave'
  return api.post(url, param)
}

export function cancelManulAddWorkplan(param){
	const url = '/workplan/delete'
	return api.get(url, param)
}
