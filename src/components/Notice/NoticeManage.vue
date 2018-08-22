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
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>敏感词：</label>
        <Input v-model="searchTitle" placeholder="敏感词" style="width: 200px"/>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
      <Button type="primary" @click="handleData('add')">添加记录</Button>
      <Button type="primary" @click="handleData('del')">删除记录</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit"  show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">

      <div v-if="currentModal==='add'">
        <div>
          <span>敏感词：</span>
          <Input v-model="name"  style="width: 300px"></Input>
        </div>
      </div>
      <div v-if="currentModal==='del'">
        <div>确定删除吗？</div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submit">{{currentModal==='del' ? '确定' : '保存'}}</Button>
        <Button type="primary" @click="back">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "NoticeManage",
    data() {
      return {
        //搜索
        searchTitle: '',
        //分页
        page:1,
        limit:10,
        total:0,
        currentPage:1,

        //弹窗
        currentModal:'',
        myModal:false,
        modalTitle:'',

        //弹窗表单
        name:'',

        paramsData:{
          Dustbin: 1
        },

        //表格
        selectArr:[],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '序号',
            width: 120,
            key: 'Id',
            align: 'center'
          }, {
            title: '名称',
            key: 'Name',
            align: 'center'
          }
        ],
        data1: []
      }
    },
    methods:{
      //表格操作
      handleData:function(str){
        this.currentModal = str;
        if(str === 'del' && !this.selectArr.length){
          this.$Message.error('请先选择要删除的数据');
          return;
        }
        this.myModal = true;
        this.modalTitle = str === 'add' ? '新增记录' : '删除记录';
      },
      //表格处理
      selectRow:function(arr){
        this.selectArr = arr;
      },

      //弹窗操作
      submit:function(){
        if(this.currentModal === 'add'){
          let obj = {
            Name: this.name
          }
          this.$http.post('Sensitives/AddList',obj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('新增成功');
            }else{
              this.$Message.error('新增失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
        if(this.currentModal === 'del'){
          let arr = this.selectArr.map(function (item) {
            return item.Id
          })
          this.$http.post('Sensitives/DelList',arr).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('删除成功');
            }else{
              this.$Message.error('删除失败');
            }
            this.myModal = false;
            this.getData();
            this.selectArr = [];
          })
        }
      },
      back:function(){
        this.myModal = false;
      },

      //分页
      changePage:function (page) {
        this.page = page;
      },
      changeLimit:function (limit) {
        this.limit = limit;
      },

      //搜索
      goSearch:function(){
        this.paramsData.Name = this.searchTitle;
        this.currentPage = 1;
        this.getData();
      },
      cancelSearch:function(){
        this.searchTitle = '';
      },

      getData:function () {
        this.paramsData.page = this.page;
        this.paramsData.limit = this.limit;
        this.$http.get('Sensitives/GetList',{params:this.paramsData}).then((res)=>{
          if(res.status === 200 && res.data.data){
            this.data1 = res.data.data;
            this.total = res.data.count;
          }
        })
      }
    },
    mounted(){
      this.getData()
    }
  }
</script>





