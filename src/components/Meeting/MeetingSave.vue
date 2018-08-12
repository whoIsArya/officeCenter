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

  .my-modal p {
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
        <Input v-model="searchTitle" placeholder="会议标题" style="width: 120px"/>
      </div>
      <div>
        <label>申请人：</label>
        <Input v-model="searchPerson" placeholder="申请人" style="width: 100px"/>
      </div>
      <div>
        <label>使用日期范围：</label>
        <DatePicker :value="searchDate" @on-change="handleSearchDateChange" :clearable="false" format="yyyy/MM/dd"
                    type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="clearSearch">清除条件</Button>
      <Button type="primary" @click="handleMeeting('del')">删除记录</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit"
            show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div class="my-modal">
        <div v-if="currentModal !== 'del'">
          <p v-if="currentModal === 'check'">申请信息（只读）</p>
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
        <div v-if="currentModal === 'check'">
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
        <div v-if="currentModal === 'del'">
          <div>确定删除该条数据？</div>
        </div>
      </div>
      <div slot="footer">
        <div v-if="currentModal !== 'check'">
          <Button type="primary" @click="submitData">{{currentModal === 'del' ? '确定' : '保存'}}</Button>
          <Button type="primary" @click="cancel">返回</Button>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script>
  // import formateDate from '@src/assets/formateDate';
  import {timestampToDate, timestampToTime} from '@/assets/formateDate'

  export default {
    name: "MeetingSave",
    data() {
      return {
        currentPage: 1,
        total: 0,
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
        page: 1,
        limit: 10,
        searchRoom: '',
        searchDate: [],
        searchTitle: '',
        searchPerson: '',
        roomList: [],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          }, {
            title: '序号',
            width: 70,
            key: 'Id',
            align: 'center'
          }, {
            title: '会议标题',
            key: 'Title',
            align: 'center'
          }, {
            title: '会议室',
            key: 'BoardroomName',
            align: 'center'
          }, {
            title: '使用日期',
            key: 'UseDate',
            align: 'center',
            render: (h, params) => {
              return h('span', timestampToDate(params.row.UseDate))
            }
          }, {
            title: '开始时间',
            key: 'UseTimeB',
            align: 'center',
            render: (h, params) => {
              return h('span', timestampToTime(params.row.UseTimeB))
            }
          }, {
            title: '结束时间',
            key: 'UseTimeE',
            align: 'center',
            render: (h, params) => {
              return h('span', timestampToTime(params.row.UseTimeE))
            }
          }, {
            title: '申请日期',
            key: 'ApplyDate',
            align: 'center',
            render: (h, params) => {
              return h('span', timestampToDate(params.row.ApplyDate))
            }
          }, {
            title: '申请人',
            key: 'Applicant',
            align: 'center'
          }, {
            title: '状态',
            key: 'Status',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              const text = row.Status === 0 ? '已提交 待审核' : row.Status === 1 ? '已分配 待提交' : '已审核';
              return h('span', {}, text)
            }
          }, {
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              //row.Status => 0,已提交（查看）  1,已分配（编辑）   2,已审核（查看）
              if (row.Status === 1) {
                return h('Icon', {
                  props: {
                    type: 'compose',
                    size: 20
                  },
                  nativeOn: {
                    click: () => {
                      this.handleMeeting('edit', row)
                    }
                  }
                })
              } else {
                return h('a', {
                  style: {
                    color: '#2d8cf0'
                  },
                  on: {
                    click: () => {
                      this.handleMeeting('check', row)
                    }
                  }
                }, '查看')
              }

            }
          }
        ],
        data1: [],
        paramsData: {},
        selectArr: []
      }
    },
    methods: {
      goSearch: function () {
        this.paramsData.BoardroomName = this.searchRoom;
        this.paramsData.Title = this.searchTitle;
        this.paramsData.Applicant = this.searchPerson;
        if (!this.searchDate.length) {
          if (this.paramsData.hasOwnProperty("UseTimeB") || this.paramsData.hasOwnProperty("UseTimeE")) {
            delete this.paramsData["UseTimeB"];
            delete this.paramsData["UseTimeE"];
          }
        } else {
          this.paramsData.UseTimeB = new Date(this.searchDate[0]).getTime();
          this.paramsData.UseTimeE = new Date(this.searchDate[1]).getTime();
        }
        this.page = 1;
        this.currentPage = 1;
        this.getData();
      },
      clearSearch: function () {
        this.searchRoom = '';
        this.searchDate = [];
        this.searchTitle = '';
        this.searchPerson = '';
      },
      handleDateChange: function (date) {
        this.useDate = date;
      },
      handleSearchDateChange: function (date) {
        this.searchDate = date;
      },
      handleTimeChange: function (time) {
        this.useTime = time;
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
      changePage: function (page) {
        this.page = page;
        this.getData();
      },
      changeLimit: function (limit) {
        this.limit = limit;
        this.getData();
      },
      submitData: function () {
        if (this.currentModal === 'del') {
          let newIdArr = this.selectArr.map(function (item) {
            return item.Id;
          });
          this.$http.post('Meeting/DelList', newIdArr).then((res) => {
            if (res.status === 200 && res.data > 0) {
              this.$Message.success('删除成功');
            } else {
              this.$Message.error('删除失败');
            }
            this.selectArr = [];
            this.myModal = false;
            this.getData();
          })
        }else{
          if (this.meetingName === '' || this.selectRoom === '' || this.useDate === '' || !this.useTime.length) {
            this.$Message.error('请先完善信息再提交');
            return
          }
          let obj = {
            Title: this.meetingName,
            BoardroomName: this.selectRoom,
            UseDate: new Date(this.useDate).getTime(),
            UseTimeB: this.getSeconds(this.useTime[0]),
            UseTimeE: this.getSeconds(this.useTime[1]),
            Participants: this.people,
            ApplyRemarks: this.remark
          };
          if (this.currentModal === 'add') {
            this.$http.post('Meeting/AddList', obj).then((res) => {
              if (res.status === 200 && res.data > 0) {
                this.$Message.success('保存成功');
              } else {
                this.$Message.error('保存失败')
              }
              this.myModal = false;
              this.getData();
            })
          } else if (this.currentModal === 'edit') {
            obj.Id = this.id;
            let arr = [];
            arr.push(obj);
            this.$http.post('Meeting/UpdList', arr).then((res) => {
              if (res.status === 200 && res.data > 0) {
                this.$Message.success('修改成功');
              } else {
                this.$Message.error('修改失败')
              }
              this.myModal = false;
              this.getData();
            })
          }
        }
      },
      cancel: function () {
        this.myModal = false;
      },
      selectRow: function (select) {
        this.selectArr = select;
        console.log('this.selectArr', this.selectArr)
      },
      getSeconds: function (time) {
        let arr = time.split(":");
        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60;
      },
      handleMeeting: function (str, row) {
        this.currentModal = str;
        this.modalTitle = str === 'del' ? '会议申请-删除' : str === 'edit' ? '会议申请-修改' : '会议申请-查看';

        if (this.currentModal === 'del') {
          if (!this.selectArr.length) {
            this.$Message.error('请先选择要删除的数据！');
            return;
          }
        }

        this.myModal = true;
        this.isReadOnly = str === 'check';
        this.isDisabled = str === 'check';
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
          if (filterArr && filterArr.length) {
            this.verifyRes = filterArr[0].ReviewRes === 0 ? '失败' : '成功';
            this.verifyMark = filterArr[0].ReviewRemarks;
          }
        }
      }
    },
    mounted() {
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
