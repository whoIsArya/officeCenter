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
        <label>会议标题：</label>
        <Input v-model="searchTitle" placeholder="会议标题" style="width: 120px" />
      </div>
      <div>
        <label>申请人：</label>
        <Input v-model="searchPerson" placeholder="申请人" style="width: 100px" />
      </div>
      <div>
        <label>使用日期范围：</label>
        <DatePicker :value="searchDate" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary">查询</Button>
      <Button type="primary">清除条件</Button>
      <Button type="primary">删除记录</Button>
    </div>
    <Table border ref="selection" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="100" show-total show-sizer show-elevator/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MeetingSave",
    data(){
      return {
        searchRoom: '',
        searchTitle: '',
        searchPerson: '',
        searchDate: [],
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
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '序号',
            width: 70,
            key: 'id',
            align: 'center'
          },{
            title: '会议标题',
            key: 'title',
            align: 'center'
          },{
            title: '会议室',
            key: 'boardroomId',
            align: 'center'
          },{
            title: '使用日期',
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
            title: '申请日期',
            key: 'applyDate',
            align: 'center'
          },{
            title: '申请人',
            key: 'applicant',
            align: 'center'
          },{
            title: '状态',
            key: 'status',
            align: 'center'
          },{
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h,params) => {
              const row = params.row;
              const text = row.id === 1 ? '查看' :  '编辑';
              return h('a',{
                style: {
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {

                  }
                }
              },text)
            }
          }
        ],
        data1: [
          {
            id: 1,
            title: '开会',
            boardroomId: '第一会议室',
            useDate: '20180302',
            useTimeB: '09:00',
            useTimeE: '12:00',
            applyDate: '20180201',
            applicant: '小A',
            status: '已提交 待审核'
          },{
            id: 2,
            title: '开会',
            boardroomId: '第二会议室',
            useDate: '20180302',
            useTimeB: '09:00',
            useTimeE: '12:00',
            applyDate: '20180201',
            applicant: '小B',
            status: '已分配 待提交'
          }
        ]
      }
    }
  }
</script>
