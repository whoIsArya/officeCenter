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
</style>
<template>
    <div>
      <div class="oper-group">
        <Button type="primary" @click="handleMeeting('add')">添加会议室</Button>
        <Button type="primary" @click="handleMeeting('del')">删除会议室</Button>
      </div>
      <Table border ref="selection" :columns="columns1" :data="data1"></Table>
      <div class="pagination">
        <Page :total="100" show-total show-sizer show-elevator/>
      </div>
      <Modal v-model="myModal" :title="modalTitle">
        <div>abc</div>
        <div slot="footer">
          <Button type="primary">保存</Button>
          <Button type="primary">返回</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default {
      name: "MeetingManage",
      data(){
        return {
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
                      this.handleMeeting('edit');
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
        handleMeeting: (str)=>{
          this.myModal = true;
          this.modalTitle = str === 'add' ? '会议申请-添加' : str === 'edit'? '会议申请-修改': '会议申请-删除'
        }
      },
      mounted(){
        var obj = {
          page: this.page,
          limit: this.limit
        }
        this.$http.get('Boardroom/GetList',{params:obj}).then((res) => {
          console.log(res);
          if(res.status === 200 && res.data.data){
            this.data1 = res.data.data;
          }else{
            this.data1 = []
          }
        })
        var addObj={
          Name: '会议室1',
          Capacity: 10,
          Address: '林荫大道10号',
          Config: '电脑 投影'
        }
        this.$http.post('Boardroom/AddList',addObj).then((res)=>{
          console.log(res)
        })
      }
    }
</script>

