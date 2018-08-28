<style>
  .bbs-center .oper-group{
    width: 100%;
    text-align: right;
    padding: 20px 0 10px 0;
  }
  .bbs-center .pagination{
    width: 100%;
    text-align: right;
    padding-top: 10px;
  }
  .bbs-center .search{
    display: flex;
    align-items: center;
    padding-top: 20px;
  }
  .bbs-center .search>.tip{
    font-weight: bold;
    margin-top: -2px;
  }
  .bbs-center .search>div{
    margin-right: 20px;
  }
  .bbs-center-modal .form-item {
    margin-bottom: 10px;
  }
  .bbs-center-modal .form-item > span {
    width: 100px;
    display: inline-block;
    text-align: left;
    vertical-align: top;
  }
  .bbs-center-modal .form-item > div{
    display: inline-block;
    width: 78%;
  }
  .bbs-center-modal .form-item > div.content > p{
    word-wrap: break-word;
    word-break: normal;
  }
  .bbs-center-modal .floor{
    display: flex;
    align-items: flex-start;
  }
  .bbs-center-modal .floor>div{
    flex: 1;
    text-align: center;
    border: 1px solid #ddd;
  }
  .bbs-center-modal .floor>.left-floor{
    width: 20%;
    padding-top: 20px;
    height: 134px;
    flex: none;
  }
  .bbs-center-modal .right-floor>.content-box{
    padding: 10px;
    height: 100px;
    border-bottom: 1px solid #ddd;;
  }
</style>
<template>
  <div class="bbs-center">
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>帖子标题：</label>
        <Input v-model="searchTitle" placeholder="帖子标题" style="width: 300px"></Input>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
      <Button type="primary" @click="handleEvent('add')">发新帖</Button>
    </div>
    <Table border :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit" show-total show-sizer show-elevator/>
    </div>

    <Modal class="bbs-center-modal" v-model="myModal" :title="modalTitle" :mask-closable="false" width="70%">
      <div v-if="currentModal === 'add'">
        <div class="form-item">
          <span style="vertical-align: top;">标题：</span>
          <Input v-model="title" placeholder="标题" style="width: 88%"></Input>
        </div>
        <div class="form-item">
          <span style="vertical-align: top;">内容：</span>
          <quill-editor style="width: 88%;display: inline-block" v-model="content" :options="editorOption" ></quill-editor>
        </div>
      </div>

      <div v-if="currentModal==='check'">
        <p style="margin-bottom: 10px; background-color: #ddd">帖子标题：{{currentData.Title}}</p>
        <div class="floor">
          <div class="left-floor">
            <p>楼层：1</p>
            <p>楼主：{{currentData.Publisher}}</p>
            <p>发帖时间：{{currentData.ReleaseDate | formateDate}}</p>
          </div>
          <div class="right-floor">
            <div class="content-box" v-html="currentData.Content"></div>
            <div>
              <Button type="primary" @click="nameBtn(currentData.Id,currentData.Publisher)">回复</Button>
              <Button type="primary" @click="changeNoteCount(currentData.Id,currentData.Good,'good')">顶({{currentData.Good}})</Button>
              <Button type="primary" @click="changeNoteCount(currentData.Id,currentData.Bad,'bad')">踩({{currentData.Bad}})</Button>
            </div>
          </div>
        </div>
        <div class="floor" v-for="(item,index) in followDataList">
          <div class="left-floor">
            <p>楼层：{{index+2}}</p>
            <p>回复：<span style="color: cornflowerblue;">@{{item.Recipient}}</span></p>
            <p>发帖人：<span style="color: cornflowerblue;">{{item.Publisher}}</span></p>
            <p>发帖时间：{{item.ReleaseDate | formateDate}}</p>
          </div>
          <div class="right-floor">
            <div class="content-box" v-html="item.Content"></div>
            <div>
              <Button type="primary" @click="nameBtn(item.Id,item.Publisher)">回复</Button>
              <Button type="primary" @click="changeCount(item.Id,item.Good,'good')">顶({{item.Good}})</Button>
              <Button type="primary" @click="changeCount(item.Id,item.Bad,'bad')">踩({{item.Bad}})</Button>
            </div>
          </div>
        </div>
        <div style="text-align: center;margin-top: 20px">
          <div class="form-item">
            <span style="vertical-align: top;">回复对象：</span>
            <Input v-model="followPeople" :readonly="true" placeholder="回复对象" style="width: 88%"></Input>
          </div>
          <div class="form-item">
            <span style="vertical-align: top;">回复内容：</span>
            <quill-editor style="width: 88%;display: inline-block" v-model="followContent" :options="editorOption" ></quill-editor>
          </div>
          <div style="text-align: center">
            <Button type="primary" @click="goFollow">发布</Button>
            <Button type="primary" @click="cancelFollow">清空</Button>
          </div>
        </div>
      </div>

      <div slot="footer">
        <Button type="primary" v-if="currentModal === 'add'" @click="submit">保存</Button>
        <Button type="primary" @click="back">返回</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  export default {
    name: "BbsCenter",
    data(){
      return {
        //弹窗表单
        title:'',
        //编辑器
        editorOption:{
          placeholder:'请输入文本...'
        },
        content:'',
        currentData:{},
        followContent:'',
        followPeople:'',
        fId:'',
        fPublisher:'',

        //跟帖列表
        followDataList:[],

        //搜索
        searchTitle: '',

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

        needVerify:1,//1需要 2不需要

        //表格
        columns1: [
          {
            title: '标题',
            key: 'Title',
            align: 'center'
          },{
            title: '发帖人',
            key: 'Publisher',
            align: 'center'
          },{
            title: '发帖时间',
            key: 'ReleaseDate',
            align: 'center',
            render: (h,parmas)=>{
              return h('span',timestampToDate(parmas.row.ReleaseDate,'all'))
            }
          },{
            title:'回复状态',
            key:'Reply',
            align:'center'
          },{
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h,params) => {
              const row = params.row;
              return h('div',[
                h('a', {
                  style: {
                    color: '#2d8cf0',
                    marginRight:'5px'
                  },
                  on: {
                    click: () => {
                      this.handleEvent('check',row)
                    }
                  }
                },'查看'),
                h('a', {
                  style: {
                    color: '#2d8cf0'
                  },
                  on: {
                    click: () => {
                      this.collect(row)
                    }
                  }
                },'收藏')
              ])
            }
          }
        ],
        data1: []
      }
    },
    filters:{
      formateDate:function (date) {
        return timestampToDate(date,'all')
      }
    },
    components: {
      quillEditor
    },
    methods:{
      //回帖
      changeCount:function(id,count,str){
        let obj = {
          Id: id
        };
        str === 'good' ? obj.Good = parseInt(count) + 1 : obj.Bad = parseInt(count) + 1;
        this.$http.post('FollowPoster/UpdList',obj).then((res)=>{
          if(res.status === 200 && res.data > 0){
            this.$Message.success('成功');
          }else{
            this.$Message.error('失败');
          }
          this.getFollow()
        })
      },
      changeNoteCount:function(id,count,str){
        let obj = {
          Id: id
        };
        str === 'good' ? obj.Good = parseInt(count) + 1 : obj.Bad = parseInt(count) + 1;
        this.$http.post('Note/UpdList',obj).then((res)=>{
          if(res.status === 200 && res.data > 0){
            this.$Message.success('成功');
            str === 'good' ? this.currentData.Good+=1 : this.currentData.Bad+=1
          }else{
            this.$Message.error('失败');
          }
        })
      },
      cancelFollow:function(){
        this.followPeople = '';
        this.followContent = '';
      },
      nameBtn:function(id,name){
        this.fId = id;
        this.followPeople = name;
      },
      goFollow:function(){
        if(!this.followPeople || !this.followContent){
          this.$Message.error('请完善表单内容');
          return
        }
        let obj = {
          Recipient: this.followPeople,
          ReleaseDate: new Date().getTime(),
          Content: this.followContent,
          Good: 0,
          Bad: 0,
          MainNoteId:this.fId,
          Publisher: 'me'
        }
        this.$http.post('FollowPoster/AddList',obj).then((res)=>{
          if(res.status === 200 && res.data > 0){
            this.$Message.success('发布成功');
          }else{
            this.$Message.error('发布失败');
          }
          this.getFollow()
        })

      },
      //表格数据处理
      collect:function(str){
        console.log(str);
        this.currentData = str;
        let obj = {
          Sysid: 0,
          Name:'me',
          NoteId:this.currentData.Id
        }
        this.$http.post('Collection/AddList',obj).then((res)=>{
          if(res.status === 200 && res.data>0){
            this.$Message.success('收藏成功');
          }else{
            this.$Message.error('收藏失败');
          }
        })
      },
      handleEvent:function(str,row){
        this.currentModal = str;
        if(row){
          this.currentData = row;
        }
        this.myModal = true;
        if(str === 'check'){
          this.getFollow();
        }
        this.modalTitle = str === 'add' ? '发新帖' : '查看'
      },
      //弹窗事件
      submit:function(){
        if(this.currentModal === 'add'){
          let obj = {
            Title: this.title,
            Content: this.content,
            ReleaseDate: new Date().getTime(),
            Good: 0,
            Bad: 0,
            Reply: '无回复',
            Publisher: 'me'
          }
          obj.Status = this.needVerify === 1 ? 1 : 3;
          this.$http.post('Note/AddList',obj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('发帖成功');
            }else{
              this.$Message.error('发帖失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
      },
      back:function(){
        this.myModal = false;
      },
      //分页
      changePage:function(page){
        this.page = page
      },
      changeLimit:function(limit){
        this.limit = limit
      },
      //搜索
      cancelSearch:function(){
        this.searchTitle = '';
      },
      goSearch:function(){
        this.paramsData.Title = this.searchTitle;
        this.currentPage = 1;
        this.getData();
      },
      getFollow:function(){
        let obj = {
          page:1,
          limit:1000
        }
        this.$http.get('FollowPoster/GetList',{params:obj}).then((res)=>{
          if(res.status === 200 && res.data.data){
            this.followDataList = res.data.data.reverse();
          }
        })
      },
      getData:function () {
        this.paramsData.page = this.page;
        this.paramsData.limit = this.limit;
        this.paramsData.Status = 3;
        this.$http.get('Note/GetList',{params:this.paramsData}).then((res)=>{
          if(res.status === 200 && res.data.data){
            this.data1 = res.data.data;
            this.total = res.data.count;
          }
        })
      }
    },
    mounted(){
      this.$http.get('Note/GetExamine').then((res)=>{
        if(res.status === 200){
          this.needVerify = res.data
        }
      })
      this.getData();
    }
  }
</script>


