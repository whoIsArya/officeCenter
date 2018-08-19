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
      <Button type="primary" @click="deleteData">删除记录</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>

    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit" show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div class="my-modal"  v-if="currentModal !== 'del'">
        <div  v-if="currentModal === 'check'">
          <p>申请信息（只读）</p>
        </div>
        <div class="row-form">
          <div>
            <span>使用日期：</span>
            <DatePicker @on-change="useDateChange" :value="carUseDate" :disabled="isDisabled" format="yyyy/MM/dd" type="date" placement="bottom-end" style="width: 160px"></DatePicker>
          </div>
          <div>
            <span>出车地点：</span>
            <Input v-model="carAddress" :disabled="isDisabled" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>目的地点：</span>
            <Input v-model="carAim" :disabled="isDisabled" style="width: 160px"></Input>
          </div>
          <div>
            <span>用车人：</span>
            <Input v-model="carUsePerson" :disabled="isDisabled" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>人数：</span>
            <Input v-model="carPeopleNum" :disabled="isDisabled" style="width: 160px"></Input>
          </div>
          <div>
            <span>事由：</span>
            <Input v-model="carReason" :disabled="isDisabled" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div style="width: 100%">
            <span style="width: 84px">使用时间范围：</span>
            <TimePicker confirm @on-change="useTimeChange" :value="useTimeRange" format="HH:mm" type="timerange" placement="bottom-end" :disabled="isDisabled" style="width: 82%"></TimePicker>
          </div>
        </div>

        <div>
          <div>
            <span>申请备注：</span>
            <Input v-model="remarks" :disabled="isDisabled" type="textarea" :rows="4" style="width: 87%"></Input>
          </div>
        </div>

      </div>

      <div class="my-modal" v-if="currentModal === 'check'">
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

      <div class="my-modal" v-if="currentModal === 'plan'">
        <p style="margin-top: 10px;">安排信息</p>
        <div class="row-form">
          <div>
            <span>车辆：</span>
            <Select v-model="selectPlanCar" style="width:130px">
              <Option v-for="item in planCarList" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
            </Select>
          </div>
          <div>
            <span>安排司机：</span>
            <Select v-model="selectPlanDriver" style="width:130px">
              <Option v-for="item in planDriverList" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
            </Select>
          </div>
        </div>

      </div>

      <div v-if="currentModal === 'del'">
        <div>确定删除该条数据？</div>
      </div>
      <div slot="footer">
        <div v-if="currentModal !== 'check'">
          <Button type="primary" @click="submit">{{currentModal === 'del' ? '确定' :currentModal === 'plan'? '保存安排结果' : '保存'}}</Button>
          <Button type="primary" @click="cancel">返回</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate'
  export default {
    name: "CarSave",
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
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
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
            title: '出车地点',
            key: 'StartingPlace',
            align: 'center'
          },{
            title: '目的地点',
            key: 'StartingPlace',
            align: 'center'
          },{
            title: '人数',
            key: 'POPNumber',
            align: 'center'
          },{
            title: '用车人',
            key: 'User',
            align: 'center'
          },{
            title: '申请人',
            key: 'Applicant',
            align: 'center'
          },{
            title: '操作步骤',
            key: 'Status',
            align: 'center',
            render: (h,params)=>{
              const row = params.row;
              var text;
              switch (row.Status){
                case 0:
                  text = '已提交 待审核';
                  break;
                case 1:
                  text = '已分配 待提交';
                  break;
                case 2:
                  text = '已审核 待分配';
                  break;
                case 3:
                  text = '未通过审核';
                  break;
                case 4:
                  text = '已安排';
                  break;
                case 5:
                  text = '车辆归还';
                  break;
              }
              return h('span',text)
            }
          },{
            title: '操作',
            key: 'operate',
            width: 180,
            align: 'center',
            render: (h,params) => {
              // 0 已提交 1 已分配 2 已审核  3 未通过审核 4 已安排 5 车辆归还
              const row = params.row;
              if(row.Status === 1){
                return h('Icon', {
                  props: {
                    type: 'compose',
                    size: 20
                  },
                  nativeOn: {
                    click: () => {
                      this.handleCarApply('edit',row)
                    }
                  }
                })
              }else if(row.Status === 4){
                return h('div',[
                  h('a',{
                    style: {
                      color: '#2d8cf0',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.changeStatus(row)
                      }
                    }
                  },'用车归还'),
                  h('a',{
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {
                        this.handleCarApply('check',row)
                      }
                    }
                  },'查看')
                ])
              }else{
                return h('a',{
                  style: {
                    color: '#2d8cf0'
                  },
                  on: {
                    click: () => {
                      this.handleCarApply('check',row)
                    }
                  }
                },'查看')
              }
            }
          }
        ],
        data1: []
      }
    },
    methods: {
      //表格操作
      deleteData: function(){
        if(!this.selectArr.length){
          this.$Message.error('请先选择要删除的数据');
          return
        }
        this.currentModal = 'del';
        this.myModal = true;
      },
      changeStatus: function(row){
        this.id = row.Id;
        let paramObj = {
          Id: this.id,
          Status: 5
        };
        this.$http.post('Drawout/UpdList',paramObj).then((res)=>{
          if(res.status === 200 && res.data>0){
            this.$Message.success('归还成功');
          }else{
            this.$Message.error('归还失败');
          }
          this.getData();
        })
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

        this.isDisabled = str === 'check';

      },
      submit: function(){
        let obj = {
          UseDate: new Date(this.carUseDate).getTime(),
          UseTimeB	: this.useTimeRange.length ? this.getSeconds(this.useTimeRange[0]) : 0,
          UseTimeE	: this.useTimeRange.length ? this.getSeconds(this.useTimeRange[1]) : 0,
          StartingPlace	: this.carAddress,
          Destination	: this.carAim,
          POPNumber	: Number(this.carPeopleNum),
          User	: this.carUsePerson,
          Reason	:this.carReason,
          ApplyRemarks	:this.remarks
        };
        if(this.currentModal === 'add'){
          obj.Status = 1;
          this.$http.post('Drawout/AddList',obj).then((res)=>{
            if(res.status === 200 && res.data>0){
              this.$Message.success('增加成功');
            }else{
              this.$Message.error('增加失败');
            }
            this.myModal = false;
            this.getData();
          })
        }

        if(this.currentModal === 'del'){
          let data = this.selectArr.map(function (item) {
            return item.Id
          });
          this.$http.post('Drawout/DelList',data).then((res)=>{
            if(res.status === 200 && res.data>0){
              this.$Message.success('删除成功');
            }else{
              this.$Message.error('删除失败');
            }
            this.getData();
            this.selectArr = [];
            this.myModal = false;
          })
        }
        if(this.currentModal === 'edit'){
          obj.Id = this.id;
          this.$http.post('Drawout/UpdList',obj).then((res)=>{
            if(res.status === 200 && res.data>0){
              this.$Message.success('修改成功');
            }else{
              this.$Message.error('修改失败');
            }
            this.getData();
            this.myModal = false;
          })
        }
      },
      cancel:function(){
        this.myModal = false;
      },
      selectRow: function (select) {
        this.selectArr = select;
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
      //  获取车辆表和司机表
      this.$http.get('Car/GetList',{params:{limit:1000,page:1}}).then((res)=>{
        if(res.status === 200 && res.data.data){
          this.planCarList = res.data.data;
        }
      });
      this.$http.get('Driver/GetList',{params:{limit:1000,page:1}}).then((res)=>{
        if(res.status === 200 && res.data.data){
          this.planDriverList = res.data.data;
        }
      })
    }
  }
</script>



