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
  .form-item {
    margin-bottom: 10px;
  }
  .form-item > span {
    width: 100px;
    display: inline-block;
    text-align: left;
    vertical-align: top;
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
        <label>日期范围：</label>
        <DatePicker :value="searchDate" @on-change="handleDateChange" :clearable="false" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
    </div>
    <Table border :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit" show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div>
        <div class="form-item">
          <span style="vertical-align: top;">内容：</span>
          <div class="content" v-html="content"></div>
        </div>
      </div>

      <div slot="footer"></div>
    </Modal>

  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  export default {
    name: "LogCheck",
    data(){
      return {
        //搜索
        searchDate: [],

        //弹窗
        content:'',
        myModal:false,
        modalTitle:'工作日志查看',
        currentModal:'',

        //分页
        page:1,
        limit:10,
        total:0,
        currentPage:1,

        paramsData:{},

        //表格
        columns1: [
          {
            title: '日志日期',
            key: 'ReleaseDate',
            align: 'center',
            render: (h,parmas)=>{
              return h('span',timestampToDate(parmas.row.ReleaseDate))
            }
          },{
            title: '记录人',
            key: 'Publisher',
            align: 'center'
          },{
            title: '内容',
            key: 'Content',
            align: 'center',
            render: (h,params)=>{
              return h('div',{
                domProps:{
                  innerHTML: params.row.Content
                }
              })
            }
          },{
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h,params) => {
              const row = params.row;
              return h('a', {
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
      //表格数据处理
      handleEvent:function(str,row){
        this.currentModal = str;
        if(row){
          this.content = row.Content;
        }
        this.myModal = true
      },

      //分页
      changePage:function(page){
        this.page = page
      },
      changeLimit:function(limit){
        this.limit = limit
      },
      //搜索
      handleDateChange:function(date){
        this.searchDate = date;
      },
      cancelSearch:function(){
        this.searchDate = [];
      },
      goSearch:function(){
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

      getData:function () {
        this.paramsData.page = this.page;
        this.paramsData.limit = this.limit;
        this.$http.get('Log/GetList',{params:this.paramsData}).then((res)=>{
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

