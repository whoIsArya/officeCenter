<style scoped>
  .oper-group {
    width: 100%;
    text-align: right;
    padding: 20px 0 10px 0;
  }

  .pagination {
    width: 100%;
    text-align: right;
    padding-top: 10px;
  }

  .search {
    display: flex;
    align-items: center;
    padding-top: 20px;
  }

  .search > .tip {
    font-weight: bold;
    margin-top: -2px;
  }

  .search > div {
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
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>车辆类型：</label>
        <Input v-model="searchType" placeholder="车辆类型" style="width: 120px"/>
      </div>
      <div>
        <label>车辆型号：</label>
        <Input v-model="searchModel" placeholder="车辆型号" style="width: 100px"/>
      </div>
      <div>
        <label>车牌号：</label>
        <Input v-model="searchNum" placeholder="车牌号" style="width: 100px"/>
      </div>
      <div>
        <label>送保人：</label>
        <Input v-model="searchPerson" placeholder="送保人" style="width: 100px"/>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
      <Button type="primary" @click="handleCar('add')">添加车辆</Button>
      <Button type="primary" @click="handleCar('del')">删除车辆</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit" show-total show-sizer show-elevator/>
    </div>
    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div v-if="currentModal === 'add' ||　currentModal === 'edit'">

        <div class="row-form">
          <div>
            <span>名称：</span>
            <Input v-model="carName" style="width: 160px"></Input>
          </div>
          <div>
            <span>车辆类型：</span>
            <Input v-model="carType" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>车辆型号：</span>
            <Input v-model="carModel" style="width: 160px"></Input>
          </div>
          <div>
            <span>车牌号：</span>
            <Input v-model="numberPlate" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>发动机号：</span>
            <Input v-model="motor" style="width: 160px"></Input>
          </div>
          <div>
            <span>载车人数：</span>
            <Input v-model="passenger" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>颜色：</span>
            <Input v-model="carColor" style="width: 160px"></Input>
          </div>
          <div>
            <span>购买日期：</span>
            <DatePicker @on-change="handleDateChange" :value="buyDate" format="yyyy/MM/dd" type="date"
                        placement="bottom-end" style="width: 160px"></DatePicker>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>保养日期：</span>
            <DatePicker @on-change="handleSaveDateChange" :value="saveDate" format="yyyy/MM/dd" type="date"
                        placement="bottom-end" style="width: 160px"></DatePicker>
          </div>
          <div>
            <span>保养单位：</span>
            <Input v-model="saveCompany" style="width: 160px"></Input>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>送保人：</span>
            <Input v-model="savePeople" style="width: 160px"></Input>
          </div>
          <div>
            <span style="width: 72px">行车公里数：</span>
            <Input v-model="kilometer" style="width: 160px"></Input>
          </div>
        </div>

        <div>
          <div>
            <span>车辆描述：</span>
            <Input v-model="carDes" type="textarea" :rows="4" style="width: 87%"></Input>
          </div>
        </div>

      </div>
      <div v-if="currentModal === 'del'">
        <div>确定删除该条数据？</div>
      </div>
      <div v-if="currentModal === 'maintenance'">
        <div class="form-item">
          <span>维护日期：</span>
          <DatePicker @on-change="handleMaintenanceDate" :value="maintenanceDate" format="yyyy/MM/dd" type="date" placement="bottom-end" style="width: 300px"></DatePicker>
        </div>
        <div class="form-item">
          <span>维护人：</span>
          <Input v-model="maintenancePeople" style="width: 300px"></Input>
        </div>
        <div class="form-item">
          <span>维护地点：</span>
          <Input v-model="maintenancePlace" style="width: 300px"></Input>
        </div>
        <div class="form-item">
          <span>维护费用：</span>
          <Input v-model="maintenanceFee" style="width: 300px"></Input>
        </div>
        <div class="form-item">
          <span>维护情况：</span>
          <Input v-model="maintenanceTip" type="textarea" :rows="4" style="width: 300px"></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submit">{{currentModal === 'del' ? '确定' : '保存'}}</Button>
        <Button type="primary" @click="cancel">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate'
  export default {
    name: "CarManage",
    data() {
      return {
        //add
        carName: '',
        passenger: '',
        motor: '',
        numberPlate: '',
        carType: '',
        carModel: '',
        carColor: '',
        savePeople: '',
        saveCompany: '',
        kilometer: '',
        carDes: '',
        saveDate: '',
        buyDate: '',

        //maintenance
        maintenanceDate: '',
        maintenancePeople: '',
        maintenancePlace: '',
        maintenanceFee: '',
        maintenanceTip: '',

        modalTitle: '',
        myModal: false,
        currentPage: 1,
        total: 0,
        page: 1,
        limit: 10,
        paramsData: {},
        currentModal: '',
        selectArr: [],
        id:'',

        //search
        searchPerson: '',
        searchType: '',
        searchModel: '',
        searchNum: '',

        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          }, {
            title: '车辆名称',
            key: 'Name',
            align: 'center'
          }, {
            title: '类型',
            key: 'Type',
            align: 'center'
          }, {
            title: '型号',
            key: 'Model',
            align: 'center'
          }, {
            title: '车牌号',
            key: 'PlateNumber',
            align: 'center'
          }, {
            title: '载客人数',
            key: 'Passenger',
            align: 'center'
          }, {
            title: '颜色',
            key: 'Color',
            align: 'center'
          }, {
            title: '状态',
            key: 'Status',
            align: 'center',
            render: (h, params) => {
              const text = params.row.Status === 0 ? '正常使用' : params.row.Status === 1 ? '维护中' : '暂停使用';
              return h('span', text)
            }
          }, {
            title: '操作',
            key: 'operate',
            width: 180,
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              if (row.Status !== 0) {
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'compose',
                      size: 20
                    },
                    style: {
                      marginRight: '5px'
                    },
                    nativeOn: {
                      click: () => {
                        this.handleCar('edit', row)
                      }
                    }
                  }),
                  h('a', {
                    style: {
                      color: '#2d8cf0',
                      margin: '0 4px'
                    },
                    on: {
                      click: () => {
                        this.changeStatus(0,row)
                      }
                    }
                  }, '正常使用'),
                  h('a', {
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {
                        this.handleCar('maintenance')
                      }
                    }
                  }, '维护记录')
                ])
              } else {
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'compose',
                      size: 20
                    },
                    style: {
                      marginRight: '5px'
                    },
                    nativeOn: {
                      click: () => {
                        this.handleCar('edit', row)
                      }
                    }
                  }),
                  h('a', {
                    style: {
                      color: '#2d8cf0',
                      margin: '0 4px'
                    },
                    on: {
                      click: () => {
                        this.changeStatus(2,row)
                      }
                    }
                  }, '暂停使用'),
                  h('a', {
                    style: {
                      color: '#2d8cf0',
                      marginRight: '4px'
                    },
                    on: {
                      click: () => {
                        this.changeStatus(1,row)
                      }
                    }
                  }, '维护'),
                  h('a', {
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {
                        this.handleCar('maintenance')
                      }
                    }
                  }, '维护记录')
                ])
              }
            }
          }
        ],
        data1: []
      }
    },
    methods: {
      goSearch: function(){
        this.paramsData.Type = this.searchType;
        this.paramsData.Model = this.searchModel;
        this.paramsData.PlateNumber = this.searchNum;
        this.paramsData.Guarantor = this.searchPerson;
        this.page = 1;
        this.currentPage =1;
        this.getData();
      },
      changeStatus: function(status,row){
        this.id = row.Id;
        let obj = {
          Id: this.id,
          Status: status
        };
        this.$http.post('Car/UpdListStu', obj).then((res) => {
          if (res.status === 200 && res.data > 0) {
            this.$Message.success('修改成功');
          } else {
            this.$Message.error('修改失败')
          }
          this.getData();
        })
      },
      submit: function () {
        let obj = {
          Name: this.carName,
          Type: this.carType,
          PlateNumber: this.numberPlate,
          Model: this.carModel,
          EngineNumber: this.motor,
          Color: this.carColor,
          GuaranteeDate: new Date(this.saveDate).getTime(),
          PurchaseDate: new Date(this.buyDate).getTime(),
          MaintenanceUnit: this.saveCompany,
          Guarantor: this.savePeople,
          Passenger: this.passenger,
          DrivingK: Number(this.kilometer),
          Remarks: this.carDes
        };
        if (this.currentModal === 'add') {
          this.$http.post('Car/AddList', obj).then((res) => {
            if (res.status === 200 && res.data > 0) {
              this.$Message.success('添加成功');
            } else {
              this.$Message.error('添加失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
        if (this.currentModal === 'del') {
          let newIdArr = this.selectArr.map(function (item) {
            return item.Id;
          });
          this.$http.post('Car/DelList', newIdArr).then((res) => {
            if (res.status === 200 && res.data > 0) {
              this.$Message.success('删除成功');
            } else {
              this.$Message.error('删除失败');
            }
            this.selectArr = [];
            this.myModal = false;
            this.getData();
          })
        }
        if (this.currentModal === 'edit') {
          obj.Id = this.id;
          this.$http.post('Car/UpdList', obj).then((res) => {
            if (res.status === 200 && res.data > 0) {
              this.$Message.success('修改成功');
            } else {
              this.$Message.error('修改失败')
            }
            this.myModal = false;
            this.getData();
          })
        }
        if(this.currentModal === 'maintenance'){
          let obj = {
            MaintenanceDate: new Date(this.maintenanceDate).getTime(),
            maintenanceName: this.maintenancePeople,
            place: this.maintenancePlace,
            Cost: this.maintenanceFee,
            Remarks: this.maintenanceTip
          };
          this.$http.post('RepairCar/AddList',obj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('添加成功');
            }else{
              this.$Message.error('添加失败')
            }
            this.myModal = false;
            this.getData();
          })
        }
      },
      handleCar: function (str, row) {
        this.currentModal = str;
        if (str === 'del') {
          if (!this.selectArr.length) {
            this.$Message.error('请先选择要删除的数据！');
            return;
          }
        }
        if (row) {
          this.id = row.Id;
          this.carName = row.Name;
          this.carType = row.Type;
          this.numberPlate = row.PlateNumber;
          this.carModel = row.Model;
          this.motor = row.EngineNumber;
          this.carColor = row.Color;
          this.saveDate = timestampToDate(row.GuaranteeDate);
          this.buyDate = timestampToDate(row.PurchaseDate);
          this.saveCompany = row.MaintenanceUnit;
          this.savePeople = row.Guarantor;
          this.passenger = row.Passenger;
          this.kilometer = row.DrivingK;
          this.carDes = row.Remarks;
        }
        this.myModal = true;
        this.modalTitle = this.currentModal === 'add' ? '车辆-增加' : this.currentModal === 'edit' ? '车辆-编辑' : this.currentModal === 'maintenance' ? '车辆维护-添加' : '车辆-删除';
      },
      selectRow: function (select) {
        this.selectArr = select;
      },
      handleSaveDateChange: function (date) {
        this.saveDate = date;
      },
      handleDateChange: function (date) {
        this.buyDate = date;
      },
      handleMaintenanceDate: function(date){
        this.maintenanceDate = date;
      },
      cancel: function () {
        this.myModal = false;
      },
      cancelSearch: function () {
        this.searchPerson = '';
        this.searchType = '';
        this.searchModel = '';
        this.searchNum = '';
      },
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
        this.$http.get('Car/GetList', {params: this.paramsData}).then((res) => {
          if (res.status === 200 && res.data.data) {
            this.data1 = res.data.data;
            this.total = res.data.count;
          }
        })
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

