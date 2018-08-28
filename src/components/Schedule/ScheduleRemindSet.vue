<template>
  <div class="schedule-set">
    <p class="title">站内提醒</p>
    <div class="unique">
      <RadioGroup v-model="daysRemind">
        <Radio label="one">提前一天</Radio>
        <Radio label="three">提前三天</Radio>
      </RadioGroup>
    </div>
    <RadioGroup v-model="remindTime">
      <Radio class="row-column" label="regular">
        <span>提醒时间</span>
      </Radio>
      <Radio class="row-column" label="custom">
        <span>自定义提醒时间</span>
        <div>
          <DatePicker type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
        </div>
      </Radio>
    </RadioGroup>
    <div class="row-column">
      <span style="width: 170px;">提醒次数</span>
      <div>
        <RadioGroup v-model="times">
          <Radio label="every">每次登录提示</Radio>
          <Radio label="once">仅提示一次</Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="btn">
      <Button style="width: 80px;" type="primary">保存</Button>
    </div>

  </div>
</template>

<script>
    export default {
        name: "ScheduleRemindSet",
      data(){
          return {
            remindTime:'custom',
            daysRemind:'one',
            times:'every'
          }
      }
    }
</script>

<style scoped>
  .schedule-set{
    position: relative;
  }
  .ivu-radio-group{
    width: 206px;
  }
  .unique{
    position: absolute;
    left: 273px;
    top: 33px;
  }
  .schedule-set .btn{
    text-align: right;
  }
  .title{
    margin: 15px 0;
    padding-left: 20px;
    background-color: #ddd;
  }
.row-column{
  display: block;
  margin-bottom: 15px;
}
  .row-column>div{
    display: inline-block;
  }
  .row-column>span{
    display: inline-block;
    width: 150px;
    margin-right: 100px;
  }
</style>
