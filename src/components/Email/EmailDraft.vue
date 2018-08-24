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
    width: 80px;
    display: inline-block;
    text-align: left;
  }
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>标题：</label>
        <Input v-model="searchTitle" placeholder="标题" style="width: 120px" />
      </div>
      <div>
        <label>日期：</label>
        <DatePicker :value="searchDate" @on-change="handleDateChange" :clearable="false" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
      <Button type="primary" @click="handleEvent('write')">写信</Button>
      <Button type="primary" @click="handleEvent('send')">转发</Button>
      <Button type="primary" @click="handleEvent('recycle')">删除</Button>
      <!--<Button type="primary" @click="handleEvent('del')">彻底删除</Button>-->
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit" show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div v-if="currentModal === 'write' || currentModal === 'check-write' || currentModal === 'check-send' ||　currentModal === 'send'">
        <div class="form-item">
          <span>收件人：</span>
          <Input v-model="toPerson" style="width: 76%"></Input>
        </div>
        <div class="form-item">
          <span>主题：</span>
          <Input v-model="topic" style="width: 76%"></Input>
        </div>
        <div class="form-item">
          <span>附件：</span>
          <Input style="width: 56%"></Input>
          <Upload action="/file/Upload?UserId=1" style="display: inline-block">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </div>
        <div class="form-item">
          <span style="vertical-align: top;">正文：</span>
          <quill-editor style="width: 76%;display: inline-block" v-model="content" :options="editorOption"></quill-editor>
        </div>
      </div>
      <div v-if="currentModal === 'check'">
        <div>
          <Button type="primary" @click="handleEvent('check-write')">回复</Button>
          <Button type="primary" @click="handleEvent('check-send')">转发</Button>
          <Button type="primary" @click="handleEvent('check-recycle')">删除</Button>
        </div>
        <h2 style="text-align: center;font-weight: bold">{{currentData.Theme}}</h2>
        <p>发件人：{{currentData.AuthorId}}</p>
        <p>时间：{{currentData.ReleaseDate | formateDate}}</p>
        <p>收件人：{{currentData.RecipientId}}</p>
        <p>附件：{{currentData.Annex}}</p>
        <p v-html="currentData.Content"></p>
      </div>
      <div v-if="currentModal === 'del' || currentModal === 'recycle' || currentModal === 'check-recycle'">
        <div>确定删除该条数据？</div>
      </div>
      <div slot="footer">
        <div class="btn-group" v-if="currentModal === 'write' || currentModal === 'check-write' || currentModal === 'check-send' || currentModal === 'send'">
          <Button type="primary" @click="handle(1)">发送</Button>
          <Button type="primary" @click="handle(3)">保存至草稿箱</Button>
        </div>
        <div v-else>
          <Button type="primary" @click="submit">确定</Button>
          <Button type="primary" @click="back">返回</Button>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  export default {
    name: "EmailDraft",
    data(){
      return {
        //弹窗表单-写信
        toPerson:'',
        topic:'',
        AuthorId:'me',
        //编辑器
        editorOption:{
          placeholder:'请输入文本...'
        },
        content:'',
        currentData:{},

        //搜索
        searchTitle: '',
        searchDate: [],

        //弹窗
        myModal:false,
        modalTitle:'',
        currentModal:'',

        //分页
        page:1,
        limit:10,
        total:0,
        currentPage:1,

        paramsData:{
          AuthorId:'me',
          Statue:3
        },

        //表格
        selectArr:[],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '收信人',
            key: 'RecipientId',
            align: 'center'
          },{
            title: '主题',
            key: 'Theme',
            align: 'center'
          },{
            title: '日期',
            key: 'ReleaseDate',
            align: 'center',
            render: (h,parmas)=>{
              return h('span',timestampToDate(parmas.row.ReleaseDate))
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
    components: {
      quillEditor
    },
    filters:{
      formateDate:function (date) {
        return timestampToDate(date,'all')
      }
    },
    methods:{
      //弹窗-写信/转发-事件
      handle:function (ind) {
        let obj = {
          AuthorId: this.AuthorId,
          RecipientId: parseInt(this.toPerson),
          Theme: this.topic,
          ReleaseDate: new Date().getTime(),
          Annex:'',
          Content: this.content,
          Statue: ind
        };
        let text = ind === 1 ? '发送' : '保存';
        this.$http.post('Letter/AddList',obj).then((res)=>{
          if(res.status === 200 && res.data > 0){
            this.$Message.success(text+'成功');
          }else{
            this.$Message.error(text+'失败');
          }
          this.myModal = false;
          this.getData();
        })
      },

      //表格数据处理
      handleEvent:function(str,row){
        this.currentModal = str;
        if(str === 'del' || str === 'recycle' || str === 'send'){
          if(!this.selectArr.length){
            this.$Message.error('请先选择表格数据');
            return
          }
        }
        if(str === 'send' && this.selectArr.length > 1){
          this.$Message.error('每次只能转发一条数据');
          return
        }
        if(str === 'send'){
          this.topic = '转发：'+ this.selectArr[0].Theme;
          this.content = '<div>' +
            '<p>...........原始邮件...........</p>'+
            '<p>发件人: '+this.selectArr[0].AuthorId+'</p>'+
            '<p>发送时间: '+timestampToDate(this.selectArr[0].ReleaseDate,"all")+'</p>'+
            '<p>收件人: '+this.selectArr[0].RecipientId+'</p>'+
            '<p>主题: '+this.selectArr[0].Theme+'</p>'+
            '<p>正文: </p>'+
            '<p>'+this.selectArr[0].Content+'</p>'+
            '</div>';
        }
        if(str === 'check-write' && JSON.stringify(this.currentData) !== '{}'){
          this.toPerson = this.currentData.AuthorId;
          this.topic = '回复：'+this.currentData.Theme ;
          this.content = '<div>' +
            '<p>...........原始邮件...........</p>'+
            '<p>发件人: '+this.currentData.AuthorId+'</p>'+
            '<p>发送时间: '+timestampToDate(this.currentData.ReleaseDate,"all")+'</p>'+
            '<p>收件人: '+this.currentData.RecipientId+'</p>'+
            '<p>主题: '+this.currentData.Theme+'</p>'+
            '<p>正文: </p>'+
            '<p>'+this.currentData.Content+'</p>'+
            '</div>';
        }
        if(str === 'check-send' && JSON.stringify(this.currentData) !== '{}'){
          this.toPerson = '';
          this.topic = '转发：'+this.currentData.Theme ;
          this.content = '<div>' +
            '<p>...........原始邮件...........</p>'+
            '<p>发件人: '+this.currentData.AuthorId+'</p>'+
            '<p>发送时间: '+timestampToDate(this.currentData.ReleaseDate,"all")+'</p>'+
            '<p>收件人: '+this.currentData.RecipientId+'</p>'+
            '<p>主题: '+this.currentData.Theme+'</p>'+
            '<p>正文: </p>'+
            '<p>'+this.currentData.Content+'</p>'+
            '</div>';
        }
        if(str === 'write'){
          this.toPerson = '';
          this.topic = '';
          this.content = '';
        }
        this.modalTitle = str === 'write' ? '写信' : str === 'send' ||　str === 'check-send' ? '写信-转发' : str === 'del' ? '彻底删除' : str === 'check' ? '查看' : str === 'check-write' ? '回复' : '删除';
        if(row){
          this.currentData = row;
        }
        this.myModal = true
      },
      selectRow:function(arr){
        this.selectArr = arr;
      },
      //弹窗事件
      submit:function(){
        if(this.currentModal === 'recycle'){
          let paramsObj = this.selectArr.map(function (item) {
            return {
              Id : item.Id,
              Statue: 2
            };
          });
          this.$http.post('Letter/UpdList',paramsObj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('删除成功');
            }else{
              this.$Message.error('删除失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
        if(this.currentModal === 'check-recycle'){
          let paramsObj = [
            {
              Id: this.currentData.Id,
              Statue: 2
            }
          ]

          this.$http.post('Letter/UpdList',paramsObj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('删除成功');
            }else{
              this.$Message.error('删除失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
        if(this.currentModal === 'del'){
          let paramsObj = this.selectArr.map(function (item) {
            return item.Id;
          });
          this.$http.post('Letter/DelList',paramsObj).then((res)=>{
            if(res.status === 200 && res.data>0){
              this.$Message.success('彻底删除成功');
            }else{
              this.$Message.error('彻底删除失败');
            }
            this.getData();
            this.myModal = false;
            this.selectArr = [];
          })
        }
      },
      back:function(){
        this.myModal = false
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
        this.searchTitle = '';
      },
      goSearch:function(){
        this.paramsData.Theme = this.searchTitle;
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
        this.$http.get('Letter/GetList',{params:this.paramsData}).then((res)=>{
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



