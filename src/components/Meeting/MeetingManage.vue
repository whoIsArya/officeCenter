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
  .form-item{
    margin-bottom: 10px;
  }
  .form-item>span{
    width: 100px;
    display: inline-block;
    text-align: left;
  }
  .form-item>b{
    color: red;
  }
</style>
<template>
    <div>
      <div class="oper-group">
        <Button type="primary" @click="handleMeeting('add')">添加会议室</Button>
        <Button type="primary" @click="handleMeeting('del')">删除会议室</Button>
      </div>
      <Table border ref="selection" @on-selection-change="selectRow" :columns="columns1" :data="data1"></Table>
      <div class="pagination">
        <Page :total="total" @on-change="changePage" @on-page-size-change="changeLimit" show-total show-sizer show-elevator/>
      </div>
      <Modal v-model="myModal" :title="modalTitle" :mask-closable="false">
        <div>
          <div v-if="currentModal !== 'del'">
            <div class="form-item">
              <span>会议室名称：</span>
              <Input v-model="meetingName" style="width: 300px"></Input>
              <b>*</b>
            </div>
            <div class="form-item">
              <span>容量：</span>
              <Input v-model="capacity" style="width: 260px"></Input>
              <em style="font-style: normal">（人）</em>
              <b>*</b>
            </div>
            <div class="form-item">
              <span>会议室地址：</span>
              <Input v-model="meetingAddress" style="width: 300px"></Input>
              <b>*</b>
            </div>
            <div class="form-item">
              <span>会议室配置：</span>
              <Input v-model="meetingConfig" style="width: 300px" type="textarea" :rows="4"></Input>
            </div>
          </div>
          <div v-if="currentModal === 'del'">
            <p>确定删除该条数据？</p>
          </div>
        </div>
        <div slot="footer">
          <Button type="primary" @click="submitData">{{currentModal === 'del' ? '确定' : '保存'}}</Button>
          <Button type="primary" @click="cancel">返回</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default {
      name: "MeetingManage",
      data(){
        return {
          selectArr:[],
          total:0,
          id:'',
          meetingName:'',
          capacity:'',
          meetingAddress:'',
          meetingConfig:'',
          currentModal:'',
          myModal: false,
          modalTitle: '标题',
          page:1,
          limit: 10,
          columns1: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },{
              title: '会议室名称',
              key: 'Name',
              align: 'center'
            },{
              title: '容量(人)',
              key: 'Capacity',
              align: 'center'
            },{
              title: '地址',
              key: 'Address',
              align: 'center'
            },{
              title: '配置',
              key: 'Config',
              align: 'center'
            },{
              title: '操作',
              key: 'Operate',
              align: 'center',
              render: (h,params) => {
                return h('Icon',{
                  props: {
                    type: 'compose',
                    size: 20
                  },
                  nativeOn: {
                    click: () => {
                      this.handleMeeting('edit', params.row);
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
        handleMeeting: function(str,row){
          this.currentModal = str;
          if(this.currentModal === 'del'){
            if(!this.selectArr.length){
              this.$Message.error('请先选择要删除的数据！');
              return;
            }
          }
          this.myModal = true;
          this.modalTitle = str === 'add' ? '会议申请-添加' : str === 'edit'? '会议申请-修改': '会议申请-删除';
          if(this.currentModal==='add'){
            this.meetingName = '';
            this.capacity = '';
            this.meetingAddress = '';
            this.meetingConfig = '';
          }else if(this.currentModal==='edit' && row){
            this.meetingName = row.Name;
            this.capacity = row.Capacity;
            this.meetingAddress = row.Address;
            this.meetingConfig = row.Config;
            this.id = row.Id;
          }
        },
        submitData: function () {
          if(this.currentModal !== 'del'){
            if(this.meetingName==='' || this.capacity==='' || this.meetingAddress===''){
              this.$Message.error('请先完善信息再提交');
              return
            }
            if(!/^\+?[1-9][0-9]*$/.test(this.capacity)){
              this.$Message.error('容量格式不对');
              return
            }
            let addObj={
              "Name": this.meetingName,
              "Capacity": parseInt(this.capacity),
              "Address": this.meetingAddress,
              "Config": this.meetingConfig
            };
            if(this.currentModal === 'add'){
              this.$http.post('Boardroom/AddList',addObj).then((res)=>{
                if(res.status === 200 && res.data > 0){
                  this.$Message.success('保存成功');
                }else{
                  this.$Message.error('保存失败')
                }
                this.myModal = false;
                this.getData();
              })
            }else if(this.currentModal === 'edit'){
              addObj.Id = this.id;
              this.$http.post('Boardroom/UpdList',addObj).then((res)=>{
                if(res.status === 200 && res.data > 0){
                  this.$Message.success('更新成功');
                }else{
                  this.$Message.error('更新失败');
                }
                this.myModal = false;
                this.getData();
              })
            }
          }else if(this.currentModal === 'del'){
            let newIdArr = this.selectArr.map(function (item) {
              return item.Id;
            });
            this.$http.post('Boardroom/DelList',newIdArr).then((res)=>{
              if(res.status === 200 && res.data > 0){
                this.$Message.success('删除成功');
                this.selectArr = [];
              }else{
                this.$Message.error('删除失败');
              }
              this.myModal = false;
              this.getData();
            })
          }
        },
        cancel: function () {
          this.myModal = false;
        },
        getData: function () {
          let obj = {
            page: this.page,
            limit: this.limit
          };
          this.$http.get('Boardroom/GetList?t='+Date.now(),{params:obj}).then((res) => {
            if(res.status === 200 && res.data.data){
              this.data1 = res.data.data;
              this.total = res.data.count;
            }else{
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
          console.log('this.selectArr',this.selectArr)
        }

      },
      mounted(){
        this.getData();
      }
    }
</script>

