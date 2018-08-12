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
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>会议室：</label>
        <Select v-model="searchRoom" style="width:100px">
          <Option v-for="item in roomList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div>
        <label>起始日期：</label>
        <DatePicker :value="searchDate" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary">查询</Button>
      <Button type="primary">清除条件</Button>
    </div>
    <Table border :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="100" show-total show-sizer show-elevator/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MeetingPlan",
    data(){
      return {
        searchRoom: '',
        searchDate: '',
        roomList: [
          {
            value: 1,
            label: '第一会议室'
          },{
            value: 2,
            label: '第二会议室'
          }
        ],
        columns1: [
          {
            title: '会议室',
            key: 'id',
            align: 'center'
          },{
            title: '第1日安排',
            key: 'one',
            align: 'center'
          },{
            title: '第2日安排',
            key: 'two',
            align: 'center'
          },{
            title: '第3日安排',
            key: 'three',
            align: 'center'
          },{
            title: '第4日安排',
            key: 'four',
            align: 'center'
          },{
            title: '第5日安排',
            key: 'five',
            align: 'center'
          },{
            title: '第6日安排',
            key: 'six',
            align: 'center'
          },{
            title: '第7日安排',
            key: 'seven',
            align: 'center'
          }
        ],
        data1: [
          {
            id: '',
            one: '2018年7月30日',
            two: '2018年7月31日',
            three: '2018年8月1日',
            four: '2018年8月2日',
            five: '2018年8月3日',
            six: '2018年8月4日',
            seven: '2018年8月5日'
          },{
            id: '第一会议室',
            one: '',
            two: '',
            three: '',
            four: '',
            five: '',
            six: '',
            seven: ''
          }
        ]
      }
    },
    mounted(){
      this.$http.get('Boardroom/GetAWkplan').then(function (res) {
        console.log(res)
      })
    }
  }productionSourceMap
</script>



