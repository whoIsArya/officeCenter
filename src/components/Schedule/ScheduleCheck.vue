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
</style>
<template>
  <div>
    <div class="oper-group">
      <Button type="primary" @click="getData">刷新</Button>
      <Button type="primary" @click="deleteData">删除记录</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" @on-page-size-change="changeLimit" show-total show-sizer
            show-elevator/>
    </div>
    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div>
        <p>确定删除数据？</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submitData">确定</Button>
        <Button type="primary" @click="cancel">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  export default {
    name: "ScheduleCheck",
    data() {
      return {
        selectArr: [],
        total: 0,
        id: '',
        myModal: false,
        modalTitle: '删除记录',
        page: 1,
        limit: 10,
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          }, {
            title: '序号',
            key: 'Id',
            align: 'center'
          }, {
            title: '日期',
            key: 'Date',
            align: 'center',
            render: (h,param) => {
              return h('span',timestampToDate(param.row.Date))
            }
          }, {
            title: '内容',
            key: 'EventCon',
            align: 'center'
          }
        ],
        data1: []
      }
    },
    methods: {
      deleteData: function () {
        if (!this.selectArr.length) {
          this.$Message.error('请先选择要删除的数据！');
          return;
        }
        this.myModal = true;
      },
      submitData: function () {
        let newIdArr = this.selectArr.map(function (item) {
          return item.Id;
        });
        this.$http.post('Schedule/DelList', newIdArr).then((res) => {
          if (res.status === 200 && res.data > 0) {
            this.$Message.success('删除成功');
          } else {
            this.$Message.error('删除失败');
          }
          this.selectArr = [];
          this.myModal = false;
          this.getData();
        })
      },
      cancel: function () {
        this.myModal = false;
      },
      getData: function () {
        let obj = {
          page: this.page,
          limit: this.limit
        };
        this.$http.get('Schedule/GetList', {params: obj}).then((res) => {
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
      selectRow: function (select) {
        this.selectArr = select;
      }

    },
    mounted() {
      this.getData();
    }
  }
</script>

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
</style>


