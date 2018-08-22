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
      <Button type="primary" @click="handleEvent('add')">新增公告</Button>
    </div>
    <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit"  show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
      <div v-if="currentModal === 'add' || currentModal === 'edit'">
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
          <span>发布对象：</span>
          <Select v-model="aim" style="width:300px">
            <Option v-for="item in aimList" :value="item.value" :key="item.value">{{ item.label}}</Option>
          </Select>
        </div>
        <div class="form-item">
          <span>人员名单：</span>
          <Input v-model="peopleList"  style="width: 300px"></Input>
        </div>
        <div class="form-item">
          <span style="vertical-align: top;">内容：</span>
          <quill-editor style="width: 300px;display: inline-block" v-model="content" :options="editorOption" ></quill-editor>
        </div>
      </div>
      <div v-if="currentModal === 'check'">
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
      <div v-if="currentModal === 'pre'">
        <h2>{{title}}</h2>
        <p>
          <span>发布人：{{publishPerson}}</span>
          <span>发布日期：{{publishDate}}</span>
        </p>
        <div v-html="content"></div>
      </div>
      <div slot="footer">
        <Button v-if="currentModal === 'add' || currentModal === 'edit'" type="primary" @click="submit">保存</Button>
        <Button type="primary" @click="back">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  export default {
    name: "NoticePublic",
    data() {
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

        //分页
        page:1,
        limit:10,
        total:0,
        currentPage:1,

        paramsData:{
          Dustbin: 1
        },

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
        aim:'',
        peopleList:'',
        aimList:[{
          value:'全校',
          label:'全校'
        },{
          value:'教师',
          label:'教师'
        },{
          value:'学生',
          label:'学生'
        }],
        publishDate:'',
        publishPerson:'',

        //弹窗
        currentModal:'',
        modalTitle:'',
        myModal:false,

        //表格
        id:'',
        selectArr:[],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          }, {
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
              if(row.Status === 1){
                return h('div',[
                  h('Icon', {
                    props: {
                      type: 'compose',
                      size: 20
                    },
                    nativeOn: {
                      click: () => {
                        this.handleEvent('edit',row)
                      }
                    }
                  }),
                  h('a',{
                    style: {
                      color: '#2d8cf0',
                      margin: '0 5px'
                    },
                    on: {
                      click: () => {
                        this.handleEvent('check',row)
                      }
                    }
                  },'查看'),
                  h('a',{
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {
                        this.handleEvent('pre',row)
                      }
                    }
                  },'预览')
                ])
              }else{
                return h('div',[
                  h('a',{
                    style: {
                      color: '#2d8cf0',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.handleEvent('check',row)
                      }
                    }
                  },'查看'),
                  h('a',{
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {
                        this.handleEvent('pre',row)
                      }
                    }
                  },'预览')
                ])
              }
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
      submit:function(){
        let obj = {
          Description: this.primary,
          Title: this.title,
          Content: this.content,
          ReleaseDate:new Date().getTime(),
          Recipient: this.aim,
          Personnel: this.peopleList,
          Status:1
        }
        if(this.currentModal === 'add'){
          this.$http.post('Placard/AddList',obj).then((res)=>{
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
          obj.Id = this.id;
          this.$http.post('Placard/UpdList',obj).then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('修改成功');
            }else{
              this.$Message.error('修改失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
      },
      back:function(){
        this.myModal = false;
      },
      //表格处理
      selectRow:function(arr){
        this.selectArr = arr;
      },
      handleEvent:function (str,row) {
        this.currentModal = str;
        if(row){
          this.id = row.Id;
          this.title = row.Title;
          this.primary = row.Description;
          this.publishDate = timestampToDate(row.ReleaseDate);
          this.publishPerson = row.Publisher;
          this.content = row.Content;
          this.aim = row.Recipient;
          this.peopleList = row.Personnel;
        }
        this.modalTitle = str === 'add' ? '公告-增加' : str === 'check'? '公告-查看': str === 'pre'? '公告-预览': '公告-修改';
        this.myModal = true;
      }
    },
    mounted(){
      this.getData();
    }
  }
</script>

