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
        <label>车辆类型：</label>
        <Input v-model="searchTitle" placeholder="车辆类型" style="width: 120px" />
      </div>
      <div>
        <label>车辆型号：</label>
        <Input v-model="searchPerson" placeholder="车辆型号" style="width: 100px" />
      </div>
      <div>
        <label>车牌号：</label>
        <Input v-model="searchPerson" placeholder="车牌号" style="width: 100px" />
      </div>
      <div>
        <label>送保人：</label>
        <Input v-model="searchPerson" placeholder="送保人" style="width: 100px" />
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary">查询</Button>
      <Button type="primary">清除条件</Button>
      <Button type="primary">添加车辆</Button>
      <Button type="primary">删除车辆</Button>
    </div>
    <Table border ref="selection" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="100" show-total show-sizer show-elevator/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CarManage",
    data(){
      return {
        searchTitle: '',
        searchPerson: '',
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '车辆名称',
            key: 'name',
            align: 'center'
          },{
            title: '类型',
            key: 'type',
            align: 'center'
          },{
            title: '型号',
            key: 'model',
            align: 'center'
          },{
            title: '车牌号',
            key: 'numberPlate',
            align: 'center'
          },{
            title: '载客人数',
            key: 'passenger',
            align: 'center'
          },{
            title: '颜色',
            key: 'color',
            align: 'center'
          },{
            title: '状态',
            key: 'status',
            align: 'center'
          },{
            title: '操作',
            key: 'operate',
            width: 180,
            align: 'center',
            render: (h,params) => {
              const row = params.row;
              if(row.status === '维护中'){
                return h('div',[
                  h('a',{
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  },'编辑'),
                  h('a',{
                    style: {
                      color: '#2d8cf0',
                      margin: '0 4px'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  },'正常使用'),
                  h('a',{
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  },'维护记录')
                ])
              }else{
                return h('div',[
                  h('a',{
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  },'编辑'),
                  h('a',{
                    style: {
                      color: '#2d8cf0',
                      margin: '0 4px'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  },'暂停使用'),
                  h('a',{
                    style: {
                      color: '#2d8cf0',
                      marginRight: '4px'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  },'维护'),
                  h('a',{
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  },'维护记录')
                ])
              }
            }
          }
        ],
        data1: [
          {
            name: 'ooo',
            type: 'abx',
            model: 'abc',
            numberPlate: 'A88888',
            passenger: '10',
            color: '红色',
            status: '维护中'
          },{
            name: 'ooo',
            type: 'abx',
            model: 'abc',
            numberPlate: 'A88888',
            passenger: '8',
            color: '红色',
            status: '正常使用'
          }
        ]
      }
    }
  }
</script>

