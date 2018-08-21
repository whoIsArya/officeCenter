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
        <label>标题：</label>
        <Input v-model="searchTitle" placeholder="标题" style="width: 120px" />
      </div>
      <div>
        <label>发布人：</label>
        <Input v-model="searchPerson" placeholder="发布人" style="width: 100px" />
      </div>
      <div>
        <label>发布日期：</label>
        <DatePicker :value="searchDate" @on-change="handleDateChange" :clearable="false" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
      <Button type="primary" @click="handleEvent('add')">新增新闻</Button>
      <Button type="primary" @click="handleEvent('del')">删除新闻</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit" show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div v-if="currentModal !== 'del'">
        <div class="form-item">
          <span>标题：</span>
          <Input v-model="title"  style="width: 300px"></Input>
        </div>
        <div class="form-item">
          <span>重要性描述：</span>
          <Select v-model="primary" style="width:300px">
            <Option v-for="item in primaryList" :value="item.value" :key="item.value">{{ item.label}}</Option>
          </Select>
        </div>
        <div class="form-item">
          <span>附件：</span>
          <Input style="width: 200px"></Input>
          <Upload action="/file/Upload?UserId=1" style="display: inline-block">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </div>
        <div class="form-item">
          <span style="vertical-align: top;">内容：</span>
          <quill-editor style="width: 300px;display: inline-block" v-model="content" :options="editorOption" ></quill-editor>
        </div>


      </div>
      <div v-else>
        <div>确定删除该条数据？</div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submit">{{currentModal === 'del'?'确定':'保存'}}</Button>
        <Button type="primary" @click="back">返回</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  export default {
    name: "NewsManage",
    data(){
      return {
        //编辑器
        editorOption:{
          placeholder:'请输入文本...'
        },
        content:'',

        //搜索
        searchTitle: '',
        searchPerson: '',
        searchDate: [],

        //弹窗表单
        primaryList:[{
          value:'普通',
          label:'普通'
        },{
          value:'重要',
          label:'重要'
        }],
        title:'',
        primary:'',

        //弹窗
        myModal:false,
        modalTitle:'',
        currentModal:'',

        //分页
        page:1,
        limit:10,
        total:0,
        currentPage:1,

        paramsData:{},

        //表格
        selectArr:[],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '重要性描述',
            key: 'Description',
            align: 'center'
          },{
            title: '标题',
            key: 'Title',
            align: 'center'
          },{
            title: '发布人',
            key: 'Publisher',
            align: 'center'
          },{
            title: '发布日期',
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
              return h('Icon', {
                props: {
                  type: 'compose',
                  size: 20
                },
                nativeOn: {
                  click: () => {
                    this.handleEvent('edit',row)
                  }
                }
              })
            }
          }
        ],
        data1: []
      }
    },
    components: {
      quillEditor
    },
    methods:{
      //表格数据处理
      handleEvent:function(str,row){
        this.currentModal = str;
        if(str === 'del' && !this.selectArr.length){
          this.$Message.error('请选择要删除的数据');
          return
        }
        this.modalTitle = str === 'add' ? '新闻-增加' : str === 'del' ? '新闻-删除' : '新闻-修改';
        if(row){
          this.primary = row.Description;
          this.title = row.Title;
          this.content = row.Content;
        }
        this.myModal = true
      },
      selectRow:function(arr){
        this.selectArr = arr;
      },
      //弹窗事件
      submit:function(){
        let obj = {
          Description: this.primary,
          Title: this.title,
          Content: this.content,
          Enclosure:'',
          ReleaseDate:new Date().getTime()
        };
        if(this.currentModal === 'add'){
          this.$http.post('News/AddList',obj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('增加成功');
            }else{
              this.$Message.error('增加失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
        if(this.currentModal === 'edit'){
          this.$http.post('News/UpdList',obj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('修改成功');
            }else{
              this.$Message.error('修改失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
        if(this.currentModal === 'del'){
          let paramsObj = this.selectArr.map(function (item) {
            return item.Id;
          });
          this.$http.post('News/DelList',paramsObj).then((res)=>{
            if(res.status === 200 && res.data>0){
              this.$Message.success('删除成功');
            }else{
              this.$Message.error('删除失败');
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

      getData:function () {
        this.paramsData.page = this.page;
        this.paramsData.limit = this.limit;
        this.$http.get('News/GetList',{params:this.paramsData}).then((res)=>{
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
