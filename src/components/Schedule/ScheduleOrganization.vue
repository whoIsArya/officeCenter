<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>机构：</label>
        <Select v-model="selectOrg" style="width:300px">
          <Option v-for="item in orgList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary" @click="">开始安排</Button>
      <Button type="primary" @click="cancelSearch">清除条件</Button>
    </div>
    <div>
      <Button type="primary" @click="goMonth('pre')">前一月</Button>
      <Button type="primary" @click="goMonth('now')">当前月</Button>
      <Button type="primary" @click="goMonth('next')">后一月</Button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ScheduleOrganization",
      data(){
          return {
            nowMonth:1,
            selectOrg:'',
            orgList:[{
              value:'机构一',
              label:'机构一'
            },{
              value:'机构二',
              label:'机构二'
            }]
          }
      },
      methods:{
        goMonth:function(str){
          if(str === 'pre'){
            this.nowMonth-=1;
            if(this.nowMonth < 1){
              this.nowMonth = 1;
            }
          }else if(str === 'now'){
            this.nowMonth = new Date().getMonth()+1;
          }else if(str === 'next'){
            this.nowMonth+=1;
            if(this.nowMonth > 12){
              this.nowMonth = 12;
            }
          }
          this.buildDate()
        },
        cancelSearch:function () {
          this.selectOrg = ''
        },
        buildDate:function () {

        }
      }
    }
</script>

<style scoped>
  .oper-group{
    width: 100%;
    text-align: right;
    padding: 20px 0 10px 0;
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
    vertical-align: top;
  }
  .form-item > div{
    display: inline-block;
    width: 78%;
  }
</style>
