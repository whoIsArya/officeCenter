<style>
  .log-write{
    margin: 20px 0;
  }
  .log-write>.quill-editor>.ql-container{
    height: 300px;
  }
  .log-write-btn{
    text-align: right;
  }
</style>
<template>
  <div>
    <div class="log-write">
      <span style="vertical-align: top;">内容：</span>
      <quill-editor style="width:95%;display: inline-block" v-model="content" :options="editorOption" ></quill-editor>
    </div>
    <div class="log-write-btn">
      <Button type="primary" @click="addLog">保存</Button>
    </div>
  </div>
</template>

<script>
  import {quillEditor} from 'vue-quill-editor'

  export default {
    name: "LogWrite",
    data() {
      return {
        //编辑器
        editorOption: {
          placeholder: '请输入文本...'
        },
        content: ''
      }
    },
    components: {
      quillEditor
    },
    methods:{
      addLog:function () {
        if(!this.content){
          this.$Message.error('请填写日志');
          return;
        }
        let obj = {
          Content: this.content,
          ReleaseDate: new Date().getTime()
        }
        this.$http.post('Log/AddList',obj).then((res)=>{
          if(res.status === 200 && res.data > 0){
            this.$Message.success('保存成功');
          }else{
            this.$Message.error('保存失败');
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
