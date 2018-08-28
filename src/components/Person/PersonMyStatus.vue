<template>
  <div>
    <Select v-model="selectStatus" style="width:300px;margin: 20px 0">
      <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <div>
      <Button type="primary" @click="cancelSelect">重置</Button>
      <Button type="primary" @click="submit">保存</Button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "PersonMyStatus",
      data(){
          return {
            selectStatus:'',
            statusList:[
              {
                value:'办公室',
                label:'办公室'
              },{
                value:'本地出差',
                label:'本地出差'
              },{
                value:'外地出差',
                label:'外地出差'
              },{
                value:'事假',
                label:'事假'
              },{
                value:'病假',
                label:'病假'
              },
            ]
          }
      },
      methods:{
        cancelSelect:function () {
          this.selectStatus = ''
        },
        submit:function () {
          if(!this.selectStatus){
            this.$Message.error('请先选择状态！');
            return
          }
          let obj = {
            Name:'me',
            Sysid:0,
            State: this.selectStatus
          }
          this.$http.post('PerState/UpdList').then((res)=>{
            if(res.status === 200 && res.data > 0){
              this.$Message.success('保存成功');
            }else{
              this.$Message.error('保存失败');
            }
          })
        }
      },
      mounted(){
          let obj= {
            Name:'me',
            Sysid:0
          }
          this.$http.get('PerState/GetList').then((res)=>{
            if(res.status === 200 && res.data.data){
              this.selectStatus = res.data.data.State;
            }
          })
      }
    }
</script>

<style scoped>

</style>
