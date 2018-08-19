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
  .row-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .row-form > div {
    margin-bottom: 10px;
  }

  .row-form > div span {
    width: 60px;
    display: inline-block;
  }

  .form-item {
    margin-bottom: 10px;
  }

  .form-item > span {
    width: 100px;
    display: inline-block;
    text-align: left;
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
        <label>使用日期范围：</label>
        <DatePicker :value="searchDate" @on-change="handleDateChange" :clearable="false"  format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
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
        </div>
        <div class="row-form">
          <div>
            <span>使用日期：</span>
            <DatePicker @on-change="useDateChange" :value="carUseDate" :disabled="true" format="yyyy/MM/dd" type="date" placement="bottom-end" style="width: 160px"></DatePicker>
          </div>
          <div>
            <span>出车地点：</span>
            <Input v-model="carAddress" :disabled="true" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>目的地点：</span>
            <Input v-model="carAim" :disabled="true" style="width: 160px"></Input>
          </div>
          <div>
            <span>用车人：</span>
            <Input v-model="carUsePerson" :disabled="true" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>人数：</span>
            <Input v-model="carPeopleNum" :disabled="true" style="width: 160px"></Input>
          </div>
          <div>
            <span>事由：</span>
            <Input v-model="carReason" :disabled="true" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div style="width: 100%">
            <span style="width: 84px">使用时间范围：</span>
            <TimePicker confirm @on-change="useTimeChange" :value="useTimeRange" format="HH:mm" type="timerange" placement="bottom-end" :disabled="true" style="width: 82%"></TimePicker>
          </div>
        </div>

        <div>
          <div>
            <span>申请备注：</span>
            <Input v-model="remarks" :disabled="true" type="textarea" :rows="4" style="width: 87%"></Input>
          </div>
        </div>

      </div>

      <div class="my-modal">
        <p style="margin-top: 10px;">处理信息（只读）</p>
        <div class="row-form">
          <div>
            <span>审核结果：</span>
            <Input v-model="verifyRes" :disabled="true" style="width: 160px"></Input>
          </div>
          <div>
            <span>审核备注：</span>
            <Input v-model="verifyMark" :disabled="true" type="textarea" :rows="4" style="width: 160px"></Input>
          </div>
        </div>

        <p>安排信息（只读）</p>
        <div class="row-form">
          <div>
            <span>车辆：</span>
            <Input v-model="checkCar" :disabled="true" style="width: 160px"></Input>
          </div>
          <div>
            <span>安排司机：</span>
            <Input v-model="checkDriver" :disabled="true" style="width: 160px"></Input>
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
    name: "CarSearch",
    data(){
      return {
        //表单
        carUseDate: '',
        carAddress: '',
        carAim: '',
        carUsePerson: '',
        carPeopleNum: '',
        carReason: '',
        remarks: '',
        useTimeRange:[],
        isDisabled: false,
        verifyRes:'',
        verifyMark:'',
        checkCar:'',
        checkDriver:'',
        resList:[
          {
            value: 1,
            label: '通过'
          },{
            value: 0,
            label: '未通过'
          }
        ],
        selectPlanCar:'',
        selectPlanDriver:'',
        planCarList:[],
        planDriverList:[],

        //分页
        total: 0,
        limit: 10,
        page: 1,
        currentPage: 1,

        //搜索
        searchDate: [],

        //弹窗
        myModal: false,
        modalTitle: '',

        //表格
        selectArr:[],
        id:'',
        currentModal: '',
        paramsData: {},
        columns1: [
          {
            title: '出车日期',
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
            title: '车辆',
            key: 'CarName',
            align: 'center'
          },{
            title: '安排人员',
            key: 'User',
            align: 'center'
          },{
            title: '出车地点',
            key: 'StartingPlace',
            align: 'center'
          },{
            title: '目的地点',
            key: 'StartingPlace',
            align: 'center'
          },{
            title: '操作',
            key: 'operate',
            width: 180,
            align: 'center',
            render: (h,params) => {
              // 0 已提交 1 已分配 2 已审核  3 未通过审核 4 已安排 5 车辆归还
              const row = params.row;
              return h('a',{
                style: {
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {
                    this.handleCarApply('check',row)
                  }
                }
              },'查看详情')
            }
          }
        ],
        data1: []
      }
    },
    methods: {
      //表格操作
      exportTable: function(){
        this.$refs.table.exportCsv({
          filename: 'Table data'
        });
      },
      handleCarApply: function(str,row){
        this.currentModal = str;
        this.myModal = true;
        this.modalTitle = str === 'add' ? '车辆申请-增加' : str === 'check' ? '车辆申请-查看': str === 'del'? '车辆申请-删除': str === 'plan' ? '车辆申请-安排': '车辆申请-编辑';
        if(row){
          this.id = row.Id;
          this.carUseDate = timestampToDate(row.UseDate);
          this.useTimeRange = [timestampToTime(row.UseTimeB),timestampToTime(row.UseTimeE)];
          this.carAddress = row.StartingPlace;
          this.carAim = row.Destination;
          this.carPeopleNum = row.POPNumber;
          this.carUsePerson = row.User;
          this.carReason = row.Reason;
          this.remarks = row.ApplyRemarks;
          this.verifyRes = row.ReviewRes === 0 ? '未通过' : '通过';
          this.verifyMark = row.ReviewRemarks;
          this.checkCar = row.CarName;
          this.checkDriver = row.DriverId;
        }

      },
      cancel:function(){
        this.myModal = false;
      },
      useDateChange:function(date){
        this.carUseDate = date;
      },
      useTimeChange:function(time){
        this.useTimeRange = time;
      },
      getSeconds: function (time) {
        let arr = time.split(":");
        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60;
      },
      //  搜索
      goSearch: function () {
        if(!this.searchDate.length){
          if(this.paramsData.hasOwnProperty("UseDateB") || this.paramsData.hasOwnProperty("UseDateE")){
            delete this.paramsData["UseDateB"];
            delete this.paramsData["UseDateE"];
          }
        } else{
          this.paramsData.UseDateB = new Date(this.searchDate[0]).getTime();
          this.paramsData.UseDateE = new Date(this.searchDate[1]).getTime();
        }
        this.page = 1;
        this.currentPage =1;
        this.getData();
      },
      cancelSearch: function () {
        this.searchDate = []
      },
      handleDateChange: function(date){
        this.searchDate = date;
      },

      //  分页
      changePage: function (page) {
        this.page = page;
        this.getData();
      },
      changeLimit: function (limit) {
        this.limit = limit;
        this.getData();
      },

      getData: function () {
        this.paramsData.page = this.page;
        this.paramsData.limit = this.limit;
        this.$http.get('Drawout/GetList',{params: this.paramsData}).then((res)=>{
          if(res.status === 200 && res.data.data){
            this.data1 = res.data.data;
            this.total = res.data.count;
          }
        })
      }
    },
    mounted(){
      this.getData();
    }
  }
</script>



