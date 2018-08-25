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

  .form-item > div {
    display: inline-block;
    width: 78%;
  }

  .form-item > div.content > p {
    word-wrap: break-word;
    word-break: normal;
  }

  .row-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .row-form > div {
    margin-bottom: 10px;
  }

  .row-form > div span {
    width: 60px;
    display: inline-block;
  }
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>公文标题：</label>
        <Input v-model="searchTitle" placeholder="标题" style="width: 120px"/>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="goSearch">查询</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
      <Button type="primary" @click="handleEvent('add')">新增公文</Button>
    </div>
    <Table border :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="total" @on-change="changePage" :current.sync="currentPage" @on-page-size-change="changeLimit"
            show-total show-sizer show-elevator/>
    </div>

    <Modal v-model="myModal" :title="modalTitle" :mask-closable="false" width="50%">
      <div v-if="currentModal !== 'check'">

        <div class="row-form">
          <div>
            <span>类型</span>
            <Select v-model="docType" style="width:250px">
              <Option v-for="item in docTypeList" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
          </div>
          <div>
            <span>文号</span>
            <Input v-model="docNum" style="width: 250px"/>
          </div>
        </div>

        <div class="row-form">
          <div>
            <span>密级</span>
            <Select v-model="docSecret" style="width:250px">
              <Option v-for="item in docSecretList" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
          </div>
          <div>
            <span>缓急</span>
            <Select v-model="docImportant" style="width:250px">
              <Option v-for="item in docImportantList" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
          </div>
        </div>

        <div class="row-form">
          <span>标题</span>
          <Input v-model="docTitle" style="width: 90%"/>
        </div>

        <div class="row-form">
          <span>主题词</span>
          <Input v-model="docTopic" style="width: 90%"/>
        </div>

        <div class="row-form">
          <span>附件</span>
          <Input style="width: 70%"/>
          <Upload action="/file/Upload?UserId=1" style="display: inline-block">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </div>

        <div class="row-form">
          <div>
            <span>拟稿人</span>
            <Input v-model="docWriter" style="width: 250px"/>
          </div>
          <div>
            <span>拟稿部门</span>
            <Input v-model="docCompany" style="width: 250px"/>
          </div>
        </div>

        <div class="row-form">
          <span>接收人</span>
          <Input v-model="docReceiver" style="width: 90%"/>
        </div>

        <div class="row-form">
          <div>
            <span>发文部门</span>
            <Input v-model="publicCompany" style="width: 250px"/>
          </div>
          <div>
            <span>发文日期</span>
            <DatePicker :value="publicDate" @on-change="handleDateChange" :clearable="false" format="yyyy/MM/dd"
                        type="date" placement="bottom-end" placeholder="选择日期范围" style="width: 250px"></DatePicker>
          </div>
        </div>

        <div class="row-form">
          <span>正文：</span>
          <quill-editor style="width: 90%;display: inline-block" v-model="docContent"
                        :options="editorOption"></quill-editor>
        </div>

      </div>
      <div v-else>
        <div class="form-item">
          <span>标题：</span>
          <div>{{title}}</div>
        </div>
        <div class="form-item">
          <span>密级：</span>
          <div>{{primary}}</div>
        </div>
        <div class="form-item">
          <span>内容：</span>
          <div v-html="content"></div>
        </div>
      </div>
      <div slot="footer">
        <Button v-if="currentModal !== 'check'" type="primary" @click="submit">保存</Button>
        <Button type="primary" @click="back">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {timestampToDate, timestampToTime} from '@/assets/formateDate';
  import {quillEditor} from 'vue-quill-editor' //调用编辑器
  export default {
    name: "DocumentPublic",
    data() {
      return {
        //弹窗表单 - 增加、编辑
        docContent: '',
        publicDate: '',//发文日期
        publicCompany: '',//发文部门
        docReceiver: '',//接收人
        docCompany: '',//拟稿部门
        docWriter: '',//拟稿人
        docTopic: '',//主题词
        docTitle: '',//标题
        docImportant: '',//缓急
        docImportantList: [{
          value: 1,
          label: '特急'
        }, {
          value: 2,
          label: '加急'
        }],
        docSecret: '', //密级
        docSecretList: [{
          value: 1,
          label: '绝密'
        }, {
          value: 2,
          label: '机密'
        }, {
          value: 3,
          label: '秘密'
        }],
        docNum: '', //文号
        docType: '', //类型,
        docTypeList: [
          {
            value: '命令（令）',
            label: '命令（令）'
          }, {
            value: '决定',
            label: '决定'
          }, {
            value: '公告',
            label: '公告'
          }, {
            value: '通告',
            label: '通告'
          }, {
            value: '通知',
            label: '通知'
          }, {
            value: '通报',
            label: '通报'
          }, {
            value: '议案',
            label: '议案'
          }, {
            value: '报告',
            label: '报告'
          }, {
            value: '请示',
            label: '请示'
          }, {
            value: '批复',
            label: '批复'
          }, {
            value: '意见',
            label: '意见'
          }, {
            value: '函',
            label: '函'
          }, {
            value: '纪要',
            label: '纪要'
          }, {
            value: '决议',
            label: '决议'
          }, {
            value: '公报',
            label: '公报'
          }],

        //编辑器
        editorOption: {
          placeholder: '请输入文本...'
        },
        //搜索
        searchTitle: '',

        //分页
        page: 1,
        limit: 10,
        total: 0,
        currentPage: 1,

        paramsData: {},

        //弹窗表单
        title: '',
        primary: '',
        content: '',

        //弹窗
        currentModal: '',
        modalTitle: '',
        myModal: false,

        //表格
        id: '',
        columns1: [
          {
            title: '标题',
            key: 'Title',
            align: 'center'
          }, {
            title: '文号',
            key: 'Number',
            align: 'center'
          }, {
            title: '类型',
            key: 'Type',
            align: 'center'
          }, {
            title: '密级',
            key: '',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              const text = row === 1 ? '绝密' : row === 2 ? "机密" : "秘密"
              return h('span', text)
            }
          }, {
            title: '缓急',
            key: 'Urgency',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              const text = row === 1 ? '特急' : "加急";
              return h('span', text)
            }
          }, {
            title: '状态',
            key: 'Status',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              const text = row.Status === 1 ? '已提交，待审核' : row.Status === 2 ? '已审核' : '未通过审核';
              return h('span', text)
            }
          }, {
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              if (row.Status === 2) {
                return h('a', {
                  style: {
                    color: '#2d8cf0'
                  },
                  on: {
                    click: () => {
                      this.handleEvent('check', row)
                    }
                  }
                }, '查看')
              } else {
                return h('div', [
                  h('a', {
                    style: {
                      color: '#2d8cf0',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.handleEvent('edit', row)
                      }
                    }
                  }, '编辑'),
                  h('a', {
                    style: {
                      color: '#2d8cf0',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.handleEvent('check', row)
                      }
                    }
                  }, '查看')
                ])
              }
            }
          }
        ],
        data1: []
      }
    },
    methods: {
      getData: function () {
        this.paramsData.page = this.page;
        this.paramsData.limit = this.limit;
        this.$http.get('Document/GetList', {params: this.paramsData}).then((res) => {
          if (res.status === 200 && res.data.data) {
            this.data1 = res.data.data;
            this.total = res.data.count;
          }
        })
      },
      handleDateChange: function (date) {
        this.publicDate = date
      },
      //搜索
      cancelSearch: function () {
        this.searchTitle = '';
      },
      goSearch: function () {
        this.paramsData.Title = this.searchTitle;
        this.currentPage = 1;
        this.getData();
      },
      //分页
      changePage: function (page) {
        this.page = page;
      },
      changeLimit: function (limit) {
        this.limit = limit;
      },
      //弹窗
      submit: function () {
        let obj = {
          Content: this.docContent,
          Date: new Date(this.publicDate).getTime(),//发文日期
          ServiceDep: this.publicCompany,//发文部门
          Recipient: this.docReceiver,//接收人
          DraftedDep:this.docCompany,//拟稿部门
          DraftedPer: this.docWriter,//拟稿人
          KeyWords: this.docTopic,//主题词
          Title: this.docTitle,//标题
          Urgency: parseInt(this.docImportant),//缓急
          Rank: parseInt(this.docSecret), //密级
          Number: parseInt(this.docNum), //文号
          Type:this.docType //类型
        };
        if (this.currentModal === 'add') {
          this.$http.post('Document/AddList', obj).then((res) => {
            if (res.status === 200 && res.data > 0) {
              this.$Message.success('增加成功');
            } else {
              this.$Message.error('增加失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
        if (this.currentModal === 'edit') {
          this.$http.post('Document/UpdList', obj).then((res) => {
            if (res.status === 200 && res.data > 0) {
              this.$Message.success('修改成功');
            } else {
              this.$Message.error('修改失败');
            }
            this.myModal = false;
            this.getData();
          })
        }
      },
      back: function () {
        this.myModal = false;
      },
      //表格处理
      handleEvent: function (str, row) {
        this.currentModal = str;
        if (row) {
          this.id = row.Id;
          this.title = row.Title;
          this.primary = row.Rank === 1 ? '绝密' : row.Rank === 2 ? "机密" : "秘密";
          this.content = row.Content;

          this.docContent = row.Content;
          this.publicDate =  timestampToDate(row.Date);//发文日期
          this.publicCompany = row.ServiceDep;//发文部门
          this.docReceiver = row.Recipient;//接收人
          this.docCompany = row.DraftedDep;//拟稿部门
          this.docWriter = row.DraftedPer;//拟稿人
          this.docTopic = row.KeyWords;//主题词
          this.docTitle = row.Title;//标题
          this.docImportant = row.Urgency;//缓急
          this.docSecret = row.Rank;//密级
          this.docNum = row.Number; //文号
          this.docType =  row.Type;//类型

        }
        this.modalTitle = str === 'add' ? '公文-增加' : str === 'edit' ? '公文-编辑' : '公告-查看';
        this.myModal = true;
      }
    },
    components: {
      quillEditor
    },
    mounted() {
      this.getData();
    }
  }
</script>



