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
  .form-item > div{
    display: inline-block;
    width: 78%;
  }
  .form-item > div.content > p{
    word-wrap: break-word;
    word-break: normal;
  }
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>标题：</label>
        <Input v-model="searchTitle" placeholder="标题" style="width: 120px"/>
      </div>
      <div>
        <label>发布人：</label>
        <Input v-model="searchPerson" placeholder="发布人" style="width: 100px"/>
      </div>
      <div>
        <label>发布日期：</label>
        <DatePicker :value="searchDate" @on-change="handleDateChange" :clearable="false"  format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
      <Button type="primary" @click="handleEvent('recovery')">恢复公告</Button>
      <Button type="primary" @click="handleEvent('del')">彻底删除</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit"  show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">

      <div v-if="currentModal==='check'">
        <div class="form-item">
          <span>标题：</span>
          <div>{{title}}</div>
        </div>
        <div class="form-item">
          <span>重要性描述：</span>
          <div>{{primary}}</div>
        </div>
        <div class="form-item">
          <span>内容：</span>
          <div v-html="content"></div>
        </div>
      </div>
      <div v-if="currentModal==='del'">
        <div>确定删除吗？</div>
      </div>
      <div v-if="currentModal==='recovery'">
        <div>确定恢复吗？</div>
      </div>
      <div slot="footer">
        <Button  v-if="currentModal !=='check'" type="primary" @click="submit">确定</Button>
        <Button type="primary" @click="back">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  export default {
    name: "NoticeDeleted",
    data() {
      return {
        //搜索
        searchTitle: '',
        searchPerson: '',
        searchDate: [],

        //分页
        page:1,
        limit:10,
        total:0,
        currentPage:1,

        paramsData:{
          Dustbin: 2
        },

        //弹窗表单
        title:'',
        primary:'',
        content:'',

        //弹窗
        currentModal:'',
        modalTitle:'',
        myModal:false,

        //表格
        selectArr:[],
        id:'',
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '重要性描述',
            key: 'Description',
            align: 'center'
          }, {
            title: '标题',
            key: 'Title',
            align: 'center'
          }, {
            title: '发布人',
            key: 'Publisher',
            align: 'center'
          }, {
            title: '发布日期',
            key: 'ReleaseDate',
            align: 'center',
            render: (h,parmas)=>{
              return h('span',timestampToDate(parmas.row.ReleaseDate))
            }
          }, {
            title: '状态',
            key: 'Status',
            align: 'center',
            render: (h,params)=>{
              const row = params.row;
              const text = row.Status === 1 ? '待审核': row.Status === 3 ? '审核失败' : '审核成功';
              return h('span',text)
            }
          }, {
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              return h('a',{
                style: {
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {
                    this.handleEvent('check',row)
                  }
                }
              },'查看')
            }
          }
        ],
        data1: []
      }
    },
    methods:{
      getData:function () {
        this.paramsData.page = this.page;
        this.paramsData.limit = this.limit;
        this.$http.get('Placard/GetList',{params:this.paramsData}).then((res)=>{
          if(res.status === 200 && res.data.data){
            this.data1 = res.data.data;
            this.total = res.data.count;
          }
        })
      },
      //搜索
      handleDateChange:function(date){
        this.searchDate = date;
      },
      cancelSearch:function(){
        this.searchDate = [];
        this.searchTitle = '';
        this.searchPerson = '';
      },
      goSearch:function(){
        this.paramsData.Title = this.searchTitle;
        this.paramsData.Publisher = this.searchPerson;
        if(this.searchDate.length){
          this.paramsData.ReleaseDateB = new Date(this.searchDate[0]).getTime();
          this.paramsData.ReleaseDateE = new Date(this.searchDate[1]).getTime();
        }else{
          if(this.paramsData.hasOwnProperty("ReleaseDateB") || this.paramsData.hasOwnProperty("ReleaseDateE")){
            delete this.paramsData["ReleaseDateB"];
            delete this.paramsData["ReleaseDateE"];
          }
        }
        this.currentPage = 1;
        this.getData();
      },
      //分页
      changePage:function (page) {
        this.page = page;
      },
      changeLimit:function (limit) {
        this.limit = limit;
      },
      //弹窗
      back:function(){
        this.myModal = false;
      },
      //表格处理
      submit:function(){
        if(this.currentModal === 'del'){
          let arr = this.selectArr.map(function (item) {
            return item.Id
          })
          this.$http.post('Placard/DelList',arr).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('删除成功');
            }else{
              this.$Message.error('删除失败');
            }
            this.selectArr = [];
            this.myModal = false;
            this.getData();
          })
        }
        if(this.currentModal === 'recovery'){
          let arr = this.selectArr.map(function (item) {
            return {
              Id: item.Id,
              Dustbin: 1
            }
          })
          this.$http.post('Placard/UpdListStu',arr).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('还原成功');
            }else{
              this.$Message.error('还原失败');
            }
            this.selectArr = [];
            this.myModal = false;
            this.getData();
          })
        }
      },
      selectRow:function(arr){
        this.selectArr = arr;
      },
      handleEvent:function (str,row) {
        this.currentModal = str;
        if(str === 'del' && !this.selectArr.length){
          this.$Message.error('请先选择要删除的数据');
          return
        }
        if(str === 'recovery' && !this.selectArr.length){
          this.$Message.error('请先选择要恢复的数据');
          return
        }
        if(row){
          this.id = row.Id;
          this.title = row.Title;
          this.primary = row.Description;
          this.content = row.Content;
        }
        this.modalTitle = str === 'recovery' ? '公告-恢复' : str === 'del' ? '公告-删除' :  '公告-查看';
        this.myModal = true;
      }
    },
    mounted(){
      this.getData();
    }
  }
</script>

