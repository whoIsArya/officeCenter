<style>
  .oper-group{
    width: 100%;
    text-align: right;
    padding: 20px 0 10px 0;
  }
  .pagination{
    width: 100%;
    text-align: right;
    padding-top: 10px;
  }
  .search{
    display: flex;
    align-items: center;
    padding-top: 20px;
  }
  .search>.tip{
    font-weight: bold;
    margin-top: -2px;
  }
  .search>div{
    margin-right: 20px;
  }
  .table-one>.ivu-table> .ivu-table-tip{
    display: none;
  }
  .table-one>.ivu-table:before{
    display: none;
  }
  .table-one>.ivu-table th{
    border-bottom: none;
  }
  .table-one+.ivu-table-wrapper>.ivu-table th{
    background-color: #fff;
  }
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>会议室：</label>
        <Select v-model="searchRoom" style="width:100px">
          <Option v-for="item in roomList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div>
        <label>起始日期：</label>
        <DatePicker :value="searchDate" @on-change="handleDateChange" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
    </div>
    <Table border class="table-one" :columns="columns1" :data="data1"></Table>
    <Table border :columns="columns2" :data="data2"></Table>
  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate'
  export default {
    name: "MeetingPlan",
    data(){
      return {
        searchRoom: '',
        searchDate: '',
        roomList: [],
        columns1: [
          {
            title: '会议室',
            key: 'id',
            align: 'center'
          },{
            title: '第1日安排',
            key: 'one',
            align: 'center'
          },{
            title: '第2日安排',
            key: 'two',
            align: 'center'
          },{
            title: '第3日安排',
            key: 'three',
            align: 'center'
          },{
            title: '第4日安排',
            key: 'four',
            align: 'center'
          },{
            title: '第5日安排',
            key: 'five',
            align: 'center'
          },{
            title: '第6日安排',
            key: 'six',
            align: 'center'
          },{
            title: '第7日安排',
            key: 'seven',
            align: 'center'
          }
        ],
        columns2:[],
        columnsData2: [
          {
            title:' ',
            key: 'name'
          },
          {
            title: timestampToDate(new Date().getTime(),true),
            key: timestampToDate(new Date().getTime(),true),
            align: 'center'
          },{
            title: timestampToDate(new Date().getTime() + 24*60*60*1000,true),
            key: timestampToDate(new Date().getTime() + 24*60*60*1000,true),
            align: 'center'
          },{
            title: timestampToDate(new Date().getTime() + 48*60*60*1000,true),
            key: timestampToDate(new Date().getTime() + 48*60*60*1000,true),
            align: 'center'
          },{
            title: timestampToDate(new Date().getTime() + 72*60*60*1000,true),
            key: timestampToDate(new Date().getTime() + 72*60*60*1000,true),
            align: 'center'
          },{
            title: timestampToDate(new Date().getTime() + 96*60*60*1000,true),
            key: timestampToDate(new Date().getTime() + 96*60*60*1000,true),
            align: 'center'
          },{
            title: timestampToDate(new Date().getTime() + 120*60*60*1000,true),
            key: timestampToDate(new Date().getTime() + 120*60*60*1000,true),
            align: 'center'
          },{
            title: timestampToDate(new Date().getTime() + 144*60*60*1000,true),
            key: timestampToDate(new Date().getTime() + 144*60*60*1000,true),
            align: 'center'
          }
        ],
        data1: [],
        data2: [],
        paramsObj:{}
      }
    },
    methods:{
      handleDateChange:function (date) {
        this.searchDate = date;
      },
      cancelSearch:function(){
        this.searchDate = '';
        this.searchRoom = '';
      },
      goSearch:function () {
        if(this.searchDate){
          this.columns2 = [
            {
              title:' ',
              key: 'name'
            },
            {
              title: timestampToDate(new Date(this.searchDate).getTime(),true),
              key: timestampToDate(new Date(this.searchDate).getTime(),true),
              align: 'center'
            },{
              title: timestampToDate(new Date(this.searchDate).getTime() + 24*60*60*1000,true),
              key: timestampToDate(new Date(this.searchDate).getTime() + 24*60*60*1000,true),
              align: 'center'
            },{
              title: timestampToDate(new Date(this.searchDate).getTime() + 48*60*60*1000,true),
              key: timestampToDate(new Date(this.searchDate).getTime() + 48*60*60*1000,true),
              align: 'center'
            },{
              title: timestampToDate(new Date(this.searchDate).getTime() + 72*60*60*1000,true),
              key: timestampToDate(new Date(this.searchDate).getTime() + 72*60*60*1000,true),
              align: 'center'
            },{
              title: timestampToDate(new Date(this.searchDate).getTime() + 96*60*60*1000,true),
              key: timestampToDate(new Date(this.searchDate).getTime() + 96*60*60*1000,true),
              align: 'center'
            },{
              title: timestampToDate(new Date(this.searchDate).getTime() + 120*60*60*1000,true),
              key: timestampToDate(new Date(this.searchDate).getTime() + 120*60*60*1000,true),
              align: 'center'
            },{
              title: timestampToDate(new Date(this.searchDate).getTime() + 144*60*60*1000,true),
              key: timestampToDate(new Date(this.searchDate).getTime() + 144*60*60*1000,true),
              align: 'center'
            }
          ]
        }else{
          this.columns2 = this.columnsData2;
        }
        this.paramsObj.UseDate = this.searchDate ? timestampToDate(new Date(this.searchDate).getTime(),true) : timestampToDate(new Date().getTime(),true);
        this.paramsObj.BoardroomName = this.searchRoom;
        this.data2 = [];
        this.getData();
      },
      getData:function () {
        this.$http.get('Boardroom/GetAWkplan',{params:this.paramsObj}).then( (res) => {
          if(res.status === 200 && res.data && res.data.data){
            let dataObj={};
            dataObj.name = res.data.boardroomname;
            res.data.data.forEach(function (item) {
              dataObj[item.usedate] = item.title;
            });
            console.log('dataobj',dataObj);
            this.data2 = [dataObj];
          }
        })
      }
    },
    mounted(){
      let obj = {
        page: 1,
        limit: 1000
      };
      this.$http.get('Boardroom/GetList', {params: obj}).then((res) => {
        if (res.status === 200 && res.data.data) {
          this.roomList = res.data.data.map(function (item) {
            let obj = {
              label: item.Name,
              value: item.Name
            };
            return obj;
          });
        }
      });
      this.columns2 = this.columnsData2;
    }
  }
</script>



