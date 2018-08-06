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
        <label>姓名：</label>
        <Input v-model="searchTitle" placeholder="姓名" style="width: 200px" />
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary">查询</Button>
      <Button type="primary">清除条件</Button>
      <Button type="primary">新增记录</Button>
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
    name: "CarDriver",
    data(){
      return {
        searchTitle: '',
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '工号',
            key: 'jobNumber',
            align: 'center'
          },{
            title: '姓名',
            key: 'name',
            align: 'center'
          },{
            title: '驾龄',
            key: 'drivingAge',
            align: 'center'
          },{
            title: '驾驶证号',
            key: 'licenseNum',
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
              },'编辑')
            }
          }
        ],
        data1: [
          {
            jobNumber: 'ooo',
            name: 'abx',
            drivingAge: 'abc',
            licenseNum: 'A88888'
          },{
            jobNumber: 'ooo',
            name: 'abx',
            drivingAge: 'abc',
            licenseNum: 'A88888'
          }
        ]
      }
    }
  }
</script>


