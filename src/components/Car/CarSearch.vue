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
        <label>日期范围：</label>
        <DatePicker :value="searchDate" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary">查询</Button>
      <Button type="primary">清除条件</Button>
      <Button type="primary">导出报表</Button>
    </div>
    <Table border ref="selection" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="100" show-total show-sizer show-elevator/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CarSearch",
    data(){
      return {
        searchDate: [],
        columns1: [
          {
            title: '出车日期',
            key: 'useDate',
            align: 'center'
          },{
            title: '开始时间',
            key: 'useTimeB',
            align: 'center'
          },{
            title: '结束时间',
            key: 'useTimeE',
            align: 'center'
          },{
            title: '车辆',
            key: 'user',
            align: 'center'
          },{
            title: '安排人员',
            key: 'applicant',
            align: 'center'
          },{
            title: '出车地点',
            key: 'startingPlace',
            align: 'center'
          },{
            title: '目的地点',
            key: 'startingPlace',
            align: 'center'
          },{
            title: '操作',
            key: 'operate',
            width: 180,
            align: 'center',
            render: (h,params) => {
              return h('a',{
                style: {
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {

                  }
                }
              },'查看详情')
            }
          }
        ],
        data1: [
          {
            useDate: 20180203,
            useTimeB: '08:00',
            useTimeE: '12:00',
            startingPlace: '学校',
            destination: '教育局',
            user: '000018',
            applicant: '小A'
          },{
            useDate: 20180203,
            useTimeB: '08:00',
            useTimeE: '12:00',
            startingPlace: '学校',
            destination: '教育局',
            user: '000018',
            applicant: '小A'
          }
        ]
      }
    }
  }
</script>





