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
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>姓名：</label>
        <Input v-model="searchTitle" placeholder="姓名" style="width: 200px"/>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
      <Button type="primary" @click="handleDriver('add')">新增记录</Button>
      <Button type="primary" @click="handleDriver('del')">删除记录</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit"
            show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div v-if="currentModal !== 'del'">
        <div class="form-item">
          <span>选择员工：</span>
          <Input v-model="people" style="width: 300px"></Input>
        </div>
        <div class="form-item">
          <span>驾龄：</span>
          <Input v-model="age" style="width: 300px"></Input>
        </div>
        <div class="form-item">
          <span>驾驶证号：</span>
          <Input v-model="number" style="width: 300px"></Input>
        </div>
        <div class="form-item">
          <span>备注：</span>
          <Input v-model="markTip" type="textarea" :rows="4" style="width: 300px"></Input>
        </div>
      </div>
      <div v-if="currentModal === 'del'">
        <div>确定删除？</div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submit">{{currentModal === 'del' ? '确定' : '保存'}}</Button>
        <Button type="primary" @click="cancel">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "CarDriver",
    data() {
      return {
        //分页
        total: 0,
        limit: 10,
        page: 1,
        currentPage: 1,

        //搜索
        searchTitle: '',

        //弹窗
        myModal: false,
        modalTitle: '',
        people: '',
        number: '',
        age: '',
        markTip: '',

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
          }, {
            title: '工号',
            key: 'JobNumber',
            align: 'center'
          }, {
            title: '姓名',
            key: 'Name',
            align: 'center'
          }, {
            title: '驾龄',
            key: 'DrivingAge',
            align: 'center'
          }, {
            title: '驾驶证号',
            key: 'LicenseNum',
            align: 'center'
          }, {
            title: '操作',
            key: 'operate',
            width: 180,
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              return h('Icon', {
                props: {
                  type: 'compose',
                  size: 20
                },
                nativeOn: {
                  click: () => {
                    this.handleDriver('edit', row)
                  }
                }
              })
            }
          }
        ],
        data1: []
      }
    },
    methods: {
      //表头操作
      handleDriver:function(str,row){
        this.currentModal = str;
        if (str === 'del') {
          if (!this.selectArr.length) {
            this.$Message.error('请先选择要删除的数据！');
            return;
          }
        }
        if(row){
          this.id = row.Id;
          this.people = row.Name;
          this.age = row.DrivingAge;
          this.number = row.LicenseNum;
        }
        this.modalTitle = str === 'add' ? '增加记录' : str === 'edit' ? '修改记录': '删除记录';
        this.myModal = true;
      },
      //弹窗
      submit: function(){
        let obj = {
          // JobNumber: '',
          Name: this.people,
          DrivingAge: Number(this.age),
          LicenseNum: Number(this.number),
        };
        if(this.currentModal === 'add'){
          this.$http.post('Driver/AddList',obj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('添加成功');
            }else{
              this.$Message.error('添加失败')
            }
            this.myModal = false;
            this.getData();
          })
        }
        if(this.currentModal === 'edit'){
          obj.Id = this.id;
          this.$http.post('Driver/UpdList',obj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('修改成功');
            }else{
              this.$Message.error('修改失败')
            }
            this.myModal = false;
            this.getData();
          })
        }
        if (this.currentModal === 'del') {
          let newIdArr = this.selectArr.map(function (item) {
            return item.Id;
          });
          this.$http.post('Driver/DelList', newIdArr).then((res) => {
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
      },
      selectRow: function (select) {
        this.selectArr = select;
      },
      cancel:function(){
        this.myModal = false;
      },
      //  搜索
      goSearch: function () {
        this.paramsData.Name = this.searchTitle;
        this.page = 1;
        this.currentPage =1;
        this.getData();
      },
      cancelSearch: function () {
        this.searchTitle = ''
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
        this.$http.get('Driver/GetList', {params:this.paramsData}).then((res) => {
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


