<style scoped>
  .email-write{
    padding: 20px;
  }
  .form-item {
    margin-bottom: 10px;
  }

  .form-item > span {
    width: 100px;
    display: inline-block;
    text-align: left;
  }
  .btn-group{
    text-align: center;
  }
</style>
<template>
  <div class="email-write">
    <div class="form-item">
      <span>收件人：</span>
      <Input v-model="toPerson" style="width: 80%"></Input>
    </div>
    <div class="form-item">
      <span>主题：</span>
      <Input v-model="topic" style="width: 80%"></Input>
    </div>
    <div class="form-item">
      <span>附件：</span>
      <Input style="width: 70%"></Input>
      <Upload action="/file/Upload?UserId=1" style="display: inline-block">
        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
      </Upload>
    </div>
    <div class="form-item">
      <span style="vertical-align: top;">正文：</span>
      <quill-editor style="width: 80%;display: inline-block" v-model="content" :options="editorOption"></quill-editor>
    </div>
    <div class="btn-group">
      <Button type="primary" @click="handle(1)">发送</Button>
      <Button type="primary" @click="handle(3)">保存至草稿箱</Button>
    </div>
  </div>
</template>

<script>
  import {quillEditor} from 'vue-quill-editor' //调用编辑器
  export default {
    name: "EmailWrite",
    components: {
      quillEditor
    },
    data(){
      return {
        //编辑器
        editorOption:{
          placeholder:'请输入文本...'
        },
        //表单
        toPerson:'',
        topic:'',
        content:'',
        AuthorId:'me'
      }
    },
    methods:{
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
        })
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>

</style>
