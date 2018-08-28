<template>
    <div class="activity-edit">
      <div class="calendar-top">
        <div>
          <Button type="primary" @click="goMonth('pre')">前一月</Button>
          <Button type="primary" @click="goMonth('now')">当前月</Button>
          <Button type="primary" @click="goMonth('next')">后一月</Button>
        </div>
        <span>{{nowDate}}</span>
      </div>
      <div>
        <Table class="table" :columns="columns1" :data="data1"></Table>
      </div>
      <div class="clander-column">
        <div class="column" v-for="(item,key) in colList">
          <div v-if="item">
            <p>
              <span>{{nowMonth+'月'+item.day+'日'}}</span>
              <a class="config" @click="setConfig(item.day)">配置</a>
            </p>
            <p>
              <span>重大活动：</span>
              <span>{{item.impevent}}</span>
            </p>
            <p>
              <span>备注：</span>
              <span>{{item.remarks}}</span>
            </p>
          </div>
        </div>
      </div>
      <Modal class="activity-edit-modal" v-model="myModal" :title="modalTitle" :mask-closable="false">
        <div class="form-item">
          <span>节假日名称：</span>
          <Input v-model="holiday"/>
        </div>
        <div class="form-item">
          <span>重大活动：</span>
          <Input v-model="activity"/>
        </div>
        <div class="form-item">
          <span>备注：</span>
          <Input v-model="remark" type="textarea" :rows="4"/>
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
        name: "ActivityEdit",
      data(){
        return {
          //弹窗
          myModal:false,
          modalTitle:'修改该日安排',

          //弹窗表单
          holiday:'',
          activity:'',
          remark:'',
          currentDay:'',

          colList:[],
          monthDays:[],
          nowYear:new Date().getFullYear(),
          nowDate:'',
          nowMonth:1,
          nowWeek:0,
          columns1:[],
          data1:[],
          weekend:['周日','周一','周二','周三','周四','周五','周六']
        }
      },
      methods:{
          submit:function(){
            if(!this.activity){
              this.$Message.error('请先完善活动信息');
              return
            }
            let obj = {
              HolidayName:this.holiday,
              Remarks:this.remark,
              ImpEvent:this.activity,
              Date: new Date(this.nowYear,this.nowMonth-1,this.currentDay).getTime()/1000
            }
            console.log(this.nowYear,this.nowMonth-1,this.currentDay)
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
            this.currentDay = item;
          this.myModal = true;
        },
        goMonth(str){
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
          this.nowDate = this.nowYear + '年' + this.nowMonth + '月';
          this.buildDate()
        },
          isRunNian:function(){
            if((this.nowYear%4===0||this.nowYear%400===0)&&this.nowYear%100!==0)
              return this.monthDays = [31,29,31,30,31,30,31,31,30,31,30,31];
            else
              return this.monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
          },
        buildDate:function () {
          this.nowWeek = new Date(this.nowYear, this.nowMonth-1,1).getDay();
          let arrEmpty = [];
          let arr = [];
          for(let i=0; i<7; i++){
            if(i<this.nowWeek){
              arrEmpty.push('')
            }
          }
          // let totalDays = this.monthDays[this.nowMonth-1];
          // for(let i = 1; i<totalDays+1; i++){
          //   arr.push(i)
          // }
          let obj={
            DateB: new Date(this.nowYear,this.nowMonth-1,1).getTime()/1000
          };
          this.$http.get('Event/GetList',{params:obj}).then((res) => {
            if(res.status === 200 && res.data.data){
              res.data.data.length = this.monthDays[this.nowMonth-1];
              res.data.data.forEach(function (item,ind) {
                item.day = ind+1
              })
              arr = res.data.data;
              for(let i=0;i<arrEmpty.length; i++){
                arr.unshift(arrEmpty[i])
              }
              this.colList = arr;
              console.log('this.colList',arr)
            }
          })

        }
      },
        mounted(){
          this.nowMonth = new Date().getMonth()+1;
          this.nowWeek = new Date(this.nowYear, this.nowMonth-1,1).getDay();
          this.nowDate = this.nowYear + '年' + this.nowMonth + '月';
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
  .activity-edit-modal .form-item {
    margin-bottom: 10px;
  }
  .activity-edit-modal .form-item > span {
    width: 100px;
    display: inline-block;
    text-align: left;
  }
  .activity-edit-modal .form-item > div{
    display: inline-block;
    width: 78%;
  }
  .activity-edit .calendar-top{
    padding: 15px 0;
    text-align: center;
    position: relative;
  }
  .activity-edit .calendar-top>div{
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -16px;
  }
  .activity-edit .calendar-top>span{
    font-weight: bold;
  }
  .activity-edit .clander-column{
    display: flex;
    align-items: center;
    width: 100%;
    flex-wrap:wrap;
  }
  .activity-edit .column{
  border: 1px solid #ddd;
  height: 100px;
 width: 14%;
    padding: 5px;
}
  .activity-edit .column div p{
    font-size: 12px;
  }
  .activity-edit .column div p:first-child{
    margin-bottom: 10px;
    text-align: center;
    position: relative;
  }
  .activity-edit .column div p:first-child .config{
    position: absolute;
    top: 0;
    right: 0;
    color: #2d8cf0;
  }
  .activity-edit .table>.ivu-table>.ivu-table-tip{
    display: none;
  }
</style>
