<template>
    <div class="time-input-box">
        <input v-bind:style="{width:width + 'px'}" v-model="hour" @input="hourChange" placeholder="时"/>
        <span>:</span>
        <input v-bind:style="{width:width + 'px'}" v-model="minute" @input="minuteChange" placeholder="分" ref="minute"/>
    </div>
</template>

<script>
    export default {
        name:'timeInputComponent',
        props:['width','time'],
        data(){
            return {
                hour:'',
                minute:'',
            }
        },
        model:{
            prop:'value',
            event:'time'
        },
        mounted(){
            if(this.time && this.time.indexOf(":") != -1){
                let strArr = this.time.split(":");
                this.hour = strArr[0];
                this.minute = strArr[1];
            }
            
        },
        computed:{
            value(){
                if(!this.hour || !this.minute){
                    return '';
                }
                let hour = parseInt(this.hour) < 10 ? ('0' + parseInt(this.hour)) : this.hour;
                let minute = parseInt(this.minute) < 10 ? ('0' + parseInt(this.minute)) : this.minute;
                return hour + ":" + minute;
            }
        },
        methods:{
            hourChange(e){
                let val = e.target.value;
                if(!this.isValidInput(val)){
                    this.hour = '';
                    this.$emit('time',this.value)
                    return false;
                }
                if(val.length == 1 && parseInt(val) > 2){
                    this.hour = '0' + val;
                    this.$refs.minute.focus();
                    this.$refs.minute.select();
                }
                if(val.length >= 2){
                    let hour = val.substr(0,2);
                    if(hour >= 24){
                        hour = val.substr(0,1);
                        this.hour = hour;
                    }else{
                        this.hour = hour;
                        this.$refs.minute.focus();
                        this.$refs.minute.select();
                    }
                }
                this.$emit('time',this.value)
            },
            minuteChange(e){
                let val = e.target.value;
                if(!this.isValidInput(val)){
                    this.minute = '';
                    this.$emit('time',this.value)
                    return false;
                }
                if(val.length >= 2){
                    let minute = val.substr(0,2);
                    if(parseInt(minute) > 59){
                        minute = val.substr(1,1);
                    }
                    this.minute = minute;
                }
                this.$emit('time',this.value)
            },
            isValidInput(val){
                if(val == null || val == undefined || val.length == 0){
                    return false;
                }

                if(!(/^[0-9]+$/.test(val))){
                    return false;
                }
                return true;
            }
        }
    }
</script>

<style scoped>
    .time-input-box input{
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
	    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
	}
	.time-input-box input:focus {
	    outline: none;
	    border-color: #409eff;
	}
	.time-input-box span{
		font-weight: 700;
	}
</style>