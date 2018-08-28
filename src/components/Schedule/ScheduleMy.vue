<template>
  <div class="schedule-my">
    <div class="calendar-top">
      <div class="left">
        <Button type="primary" @click="goCheck('pre')">前一月(周)</Button>
        <Button type="primary" @click="goCheck('now')">当前月(周)</Button>
        <Button type="primary" @click="goCheck('next')">后一月(周)</Button>
      </div>
      <span>{{nowYear + '年' + nowMonth + '月'}}</span>
      <div class="right">
        <Button type="primary" @click="checkby('week')">按周查看</Button>
        <Button type="primary" @click="checkby('month')">按月查看</Button>
      </div>
    </div>
    <div>
      <Table class="table" :columns="columns1" :data="data1"></Table>
    </div>

    <div v-if="checkBy === 'month'">
      <div class="clander-column">
        <div class="column" v-for="(item,key) in colList">
          <div v-if="item">
            <p>
              <span>{{nowMonth+'月'+item+'日'}}</span>
            </p>
            <a class="config" @click="setConfig(item)">增加安排</a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="checkBy === 'week'">
      <div class="clander-column">
        <div class="column" v-for="(item,key) in weekList">
          <div v-if="item.month">
            <p>
              <span>{{item.month+'月'+item.date+'日'}}</span>
            </p>
            <a class="config" @click="setConfig(item)">增加安排</a>
          </div>
        </div>
      </div>
    </div>

    <Modal class="schedule-my-modal" v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div class="form-item">
        <span>内容：</span>
        <Input v-model="content" type="textarea" :rows="4"/>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submit">保存</Button>
        <Button type="primary" @click="back">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  export default {
    name: "ScheduleMy",
    data(){
      return {
        checkBy:'week',
        //弹窗
        myModal:false,
        modalTitle:'增加日程安排',

        //弹窗表单
        content:'',
        selectedDay:'',

        colList:[],
        weekList:[],
        monthDays:[],
        nowYear:new Date().getFullYear(),
        showDate:'',
        nowMonth:1,
        firstDayWeek:0,
        currentDayWeek:0,
        currentDate:'',
        columns1:[],
        data1:[],
        weekend:['周日','周一','周二','周三','周四','周五','周六']
      }
    },
    methods:{
      checkby:function(str){
        this.currentDayWeek = new Date().getDay();//礼拜几
        this.currentDate = new Date().getDate();//几号
        this.nowMonth = new Date().getMonth()+1;
        this.checkBy = str;
        this.buildDate();
      },
      submit:function(){
        if(!this.activity){
          this.$Message.error('请先完善活动信息');
          return
        }
        let obj = {
          HolidayName:this.holiday,
          Remarks:this.remark,
          ImpEvent:this.activity,
          Date: new Date(this.nowYear,this.nowMonth-1,this.selectedDay).getTime()/1000
        }
        console.log(this.nowYear,this.nowMonth-1,this.selectedDay)
        this.$http.post('Event/AddList',obj).then((res)=>{
          if(res.status === 200 && res.data > 0){
            this.$Message.success('配置成功');
          }else{
            this.$Message.error('配置失败');
          }
          this.myModal = false;
          this.buildDate();
        })
      },
      back:function(){
        this.myModal = false;
      },
      //配置弹窗
      setConfig:function(item){
        this.selectedDay = this.checkBy === 'month' ? item : item.date;
        this.myModal = true;
      },
      goCheck(str){
        if(this.checkBy === 'month'){
          this.goMonth(str)
        }else{
          this.goWeek(str)
        }
      },
      goMonth:function(str){
        if(str === 'pre'){
          this.nowMonth-=1;
          if(this.nowMonth < 1){
            this.nowMonth = 1;
          }
        }else if(str === 'now'){
          this.nowMonth = new Date().getMonth()+1;
        }else if(str === 'next'){
          this.nowMonth+=1;
          if(this.nowMonth > 12){
            this.nowMonth = 12;
          }
        }
        this.buildDate()
      },
      goWeek:function(str){
        if(str === 'pre'){
          //前一周
          if(!this.weekList[0].month || (this.weekList[0].date - 1 < 1 && this.weekList[0].month - 1 < 1)){
            return
          }
          this.currentDayWeek = 6;
          //如果当前是1号,前一天就是上个月的最后一天
          if(this.weekList[0].date - 1 < 1){
            let mon = this.weekList[0].month - 1;
            this.currentDate = this.monthDays[mon-1];
            this.nowMonth-=1;
          }else{
            this.nowMonth = this.weekList[0].month;
            this.currentDate = this.weekList[0].date - 1;
          }
          this.buildDate()
        }else if(str === 'next'){
          let lastDay = this.weekList[6];
          let cmon = lastDay.month;
          if(!lastDay.month || (lastDay.date + 1 > this.monthDays[cmon-1] && lastDay.month + 1 > 12)){
            return
          }
          this.currentDayWeek = 0;
          //如果当前是当月最后一天，后一天就是加1月的第一天
          if(lastDay.date + 1 > this.monthDays[cmon-1]){
            this.currentDate = 1;
            this.nowMonth+=1;
          }else{
            this.nowMonth = lastDay.month;
            this.currentDate = lastDay.date + 1
          }
          this.buildDate()
        }else if(str === 'now'){
          this.currentDayWeek = new Date().getDay();//礼拜几
          this.currentDate = new Date().getDate();//几号
          this.nowMonth = new Date().getMonth()+1;
          this.buildDate()
        }
      },
      isRunNian:function(){
        if((this.nowYear%4===0||this.nowYear%400===0)&&this.nowYear%100!==0)
          return this.monthDays = [31,29,31,30,31,30,31,31,30,31,30,31];
        else
          return this.monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
      },
      checkByWeek(){
        let arr = [];
        let dateAdd = this.currentDate;
        let dateReduce = this.currentDate;
        let monthAdd = this.nowMonth;
        let monthReduce = this.nowMonth;
        let obj = {
          date: dateAdd,
          month: monthAdd
        };
        arr.push(obj);
        //向左减this.currentDayWeek次
        if(this.currentDayWeek > 0){
          for(let i=0; i<this.currentDayWeek; i++){
            if(dateReduce<=1){
              if(!monthReduce || monthReduce <= 1){
                dateReduce = 999;
                monthReduce = '';
              }else{
                dateReduce = this.monthDays[this.nowMonth-2]+1;
                monthReduce-=1;
              }
            }
            arr.unshift({
              date: --dateReduce,
              month: monthReduce
            })
          }
        }
        //向右 加6-this.currentDayWeek次
        if(this.currentDayWeek<6){
          for(let i=0; i<6-this.currentDayWeek; i++){
            if(dateAdd >= this.monthDays[this.nowMonth-1]){
              if(!monthAdd || monthAdd >= 12){
                dateAdd = 999;
                monthAdd = '';
              }else{
                dateAdd = 0;
                monthAdd+=1;
                this.nowMonth+=1
              }
            }
            arr.push({
              date: ++dateAdd,
              month: monthAdd
            });
          }
        }
        this.weekList = arr;
        console.log('this.colList-week',arr)
      },
      checkByMonth(){
        //看每个月的第一天是周几
        this.firstDayWeek = new Date(this.nowYear, this.nowMonth-1,1).getDay();
        let arrEmpty = [];
        let arr = [];
        for(let i=0; i<7; i++){
          if(i<this.firstDayWeek){
            arrEmpty.push('')
          }
        }
        let totalDays = this.monthDays[this.nowMonth-1];
        for(let i = 1; i<totalDays+1; i++){
          arr.push(i)
        }
        for(let i=0;i<arrEmpty.length; i++){
          arr.unshift(arrEmpty[i])
        }
        this.colList = arr;
        console.log('this.colList-month',arr)
      },
      buildDate:function () {
        if(this.checkBy === 'week'){
          this.checkByWeek()
        }else{
          this.checkByMonth()
        }
      }
    },
    mounted(){
      this.currentDayWeek = new Date().getDay();//礼拜几
      this.currentDate = new Date().getDate();//几号
      this.nowMonth = new Date().getMonth()+1;
      this.showDate = this.nowYear + '年' + this.nowMonth + '月';
      this.firstDayWeek = new Date(this.nowYear, this.nowMonth-1,1).getDay();
      this.columns1 = this.weekend.map(function (item, ind) {
        return {
          key: ind,
          title: item,
          align: 'center'
        }
      });
      this.isRunNian();
      this.buildDate();
    }

  }
</script>

<style>
  .schedule-my-modal .form-item {
    margin-bottom: 10px;
  }
  .schedule-my-modal .form-item > span {
    width: 100px;
    display: inline-block;
    text-align: left;
  }
  .schedule-my-modal .form-item > div{
    display: inline-block;
    width: 78%;
  }
  .schedule-my .calendar-top{
    padding: 15px 0;
    text-align: center;
    position: relative;
  }
  .schedule-my .calendar-top>div{
    position: absolute;
    top: 50%;
    margin-top: -16px;
  }
  .schedule-my .calendar-top>div.left{
    left: 0;
  }
  .schedule-my .calendar-top>div.right{
    right: 0;
  }
  .schedule-my .calendar-top>span{
    font-weight: bold;
  }
  .schedule-my .clander-column{
    display: flex;
    align-items: center;
    width: 100%;
    flex-wrap:wrap;
  }
  .schedule-my .column{
    border: 1px solid #ddd;
    height: 100px;
    width: 14%;
    padding: 5px;
  }
  .schedule-my .column div p{
    font-size: 12px;
  }
  .schedule-my .column div p:first-child{
    margin-bottom: 10px;
  }
  .schedule-my .column div a{
    color: #2d8cf0;
  }
  .schedule-my .table>.ivu-table>.ivu-table-tip{
    display: none;
  }
</style>


