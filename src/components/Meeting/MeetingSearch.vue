<style scoped>
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
  .form-item {
    margin-bottom: 10px;
  }

  .form-item > span {
    width: 100px;
    display: inline-block;
    text-align: left;
  }

  .form-item > b {
    color: red;
  }
  .my-modal p{
    margin-bottom: 10px;
    background-color: #53a7ff;
    padding: 5px 0;
    color: #fff;
    border-radius: 3px;
    padding-left: 10px;
    box-sizing: border-box;
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
        <label>会议标题：</label>
        <Input v-model="searchTitle" placeholder="会议标题" style="width: 120px" />
      </div>
      <div>
        <label>申请人：</label>
        <Input v-model="searchPerson" placeholder="申请人" style="width: 100px" />
      </div>
      <div>
        <label>使用日期范围：</label>
        <DatePicker :value="searchDate" @on-change="handleSearchDateChange" :clearable="false" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="clearSearch">清除条件</Button>
      <Button type="primary" @click="exportTable">导出报表</Button>
    </div>
    <Table border ref="table" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit" show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div class="my-modal">
        <div>
          <p>申请信息（只读）</p>
          <div class="form-item">
            <span>会议标题：</span>
            <Input v-model="meetingName" :readonly="isReadOnly" :disabled="isDisabled" style="width: 300px"></Input>
            <b>*</b>
          </div>
          <div class="form-item">
            <span>申请会议室：</span>
            <Select v-model="selectRoom" :disabled="isDisabled" style="width:300px">
              <Option v-for="item in roomList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <b>*</b>
          </div>
          <div class="form-item">
            <span>使用日期：</span>
            <DatePicker @on-change="handleDateChange" :readonly="isReadOnly" :disabled="isDisabled" :value="useDate"
                        format="yyyy/MM/dd" type="date" placement="bottom-end" style="width: 300px"></DatePicker>
            <b>*</b>
          </div>
          <div class="form-item">
            <span>使用时间范围：</span>
            <TimePicker confirm @on-change="handleTimeChange" :readonly="isReadOnly" :disabled="isDisabled"
                        :value="useTime" format="HH:mm" type="timerange" placement="bottom-end"
                        style="width: 300px"></TimePicker>
            <b>*</b>
          </div>
          <div class="form-item">
            <span>与会人员：</span>
            <Input v-model="people" :readonly="isReadOnly" :disabled="isDisabled" style="width: 300px"></Input>
          </div>
          <div class="form-item">
            <span>申请备注：</span>
            <Input v-model="remark" :readonly="isReadOnly" :disabled="isDisabled" type="textarea" :rows="4"
                   style="width: 300px"></Input>
          </div>
        </div>
        <div>
          <p>处理信息（只读）</p>
          <div class="form-item">
            <span>审核结果：</span>
            <Input v-model="verifyRes" :readonly="isReadOnly" :disabled="isDisabled" style="width: 300px"></Input>
          </div>
          <div class="form-item">
            <span>审核备注：</span>
            <Input v-model="verifyMark" :readonly="isReadOnly" :disabled="isDisabled" type="textarea" :rows="4"
                   style="width: 300px"></Input>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate'
  export default {
    name: "MeetingSearch",
    data(){
      return {
        currentPage:1,
        total:0,
        page: 1,
        limit: 10,
        verifyRes: '',
        verifyMark: '',
        isDisabled: false,
        isReadOnly: false,
        id: '',
        people: '',
        remark: '',
        useTime: [],
        useDate: '',
        selectRoom: '',
        meetingName: '',
        currentModal: '',
        myModal: false,
        modalTitle: '',
        searchRoom: '',
        searchTitle: '',
        searchPerson: '',
        searchDate: [],
        roomList: [],
        columns1: [
          {
            title: '序号',
            width: 70,
            key: 'Id',
            align: 'center'
          },{
            title: '会议标题',
            key: 'Title',
            align: 'center'
          },{
            title: '会议室',
            key: 'BoardroomName',
            align: 'center'
          },{
            title: '使用日期',
            key: 'UseDate',
            align: 'center',
            render: (h, params) => {
              return h('span', timestampToDate(params.row.UseDate))
            }
          },{
            title: '开始时间',
            key: 'UseTimeB',
            align: 'center',
            render: (h, params) => {
              return h('span', timestampToTime(params.row.UseTimeB))
            }
          },{
            title: '结束时间',
            key: 'UseTimeE',
            align: 'center',
            render: (h, params) => {
              return h('span', timestampToTime(params.row.UseTimeE))
            }
          },{
            title: '申请日期',
            key: 'ApplyDate',
            align: 'center',
            render: (h, params) => {
              return h('span', timestampToDate(params.row.ApplyDate))
            }
          },{
            title: '申请人',
            key: 'Applicant',
            align: 'center'
          },{
            title: '状态',
            key: 'Status',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              const text = row.Status === 0 ? '已提交 待审核' : row.Status === 1 ? '已分配' : '已审核';
              return h('span', {}, text)
            }
          },{
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h,params) => {
              const row = params.row;
              return h('a',{
                style: {
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {
                    this.handleMeeting('check', row)
                  }
                }
              },'查看详情')
            }
          }
        ],
        data1: [],
        paramsData:{}
      }
    },
    methods:{
      exportTable: function(){
        this.$refs.table.exportCsv({
          filename: 'Table data'
        });
      },
      goSearch: function(){
        this.paramsData.BoardroomName = this.searchRoom;
        this.paramsData.Title = this.searchTitle;
        this.paramsData.Applicant = this.searchPerson;
        if(!this.searchDate.length){
          if(this.paramsData.hasOwnProperty("UseTimeB") || this.paramsData.hasOwnProperty("UseTimeE")){
            delete this.paramsData["UseTimeB"];
            delete this.paramsData["UseTimeE"];
          }
        } else{
          this.paramsData.UseTimeB = new Date(this.searchDate[0]).getTime();
          this.paramsData.UseTimeE = new Date(this.searchDate[1]).getTime();
        }
        this.page = 1;
        this.currentPage = 1;
        this.getData();
      },
      clearSearch: function(){
        this.searchRoom = '';
        this.searchDate = [];
        this.searchTitle = '';
        this.searchPerson = '';
      },
      handleDateChange: function (date) {
        this.useDate = date;
      },
      handleSearchDateChange: function(date){
        this.searchDate = date;
      },
      handleTimeChange: function (time) {
        this.useTime = time;
      },
      changePage: function (page) {
        this.page = page;
        this.getData();
      },
      changeLimit: function (limit) {
        this.limit = limit;
        this.getData();
      },
      cancel: function () {
        this.myModal = false;
      },
      getSeconds: function (time) {
        let arr = time.split(":");
        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60;
      },
      handleMeeting: function (str, row) {
        this.currentModal = str;
        this.myModal = true;
        this.modalTitle = '会议申请-查看';
        this.isReadOnly = true;
        this.isDisabled = true;
        if (row) {
          this.id = row.Id;
          this.meetingName = row.Title;
          this.selectRoom = row.BoardroomName;
          this.useDate = timestampToDate(row.UseDate);
          this.useTime = [timestampToTime(row.UseTimeB), timestampToTime(row.UseTimeE)];
          this.people = row.Participants;
          this.remark = row.ApplyRemarks;
          let filterArr = this.data1.filter(function (item) {
            return item.Id === row.Id
          });
          if(filterArr && filterArr.length){
            this.verifyRes = filterArr[0].ReviewRes === 0 ? '失败' : '成功';
            this.verifyMark = filterArr[0].ReviewRemarks;
          }
        }
      },
      getData: function () {
        this.paramsData.page = this.page;
        this.paramsData.limit = this.limit;
        this.$http.get('Meeting/GetList', {params: this.paramsData}).then((res) => {
          if (res.status === 200 && res.data.data) {
            this.data1 = res.data.data;
            this.total = res.data.count;
          } else {
            this.data1 = []
          }
        })
      },
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
      this.getData();
    }
  }
</script>

