<style scoped>
  .oper-group {
    width: 100%;
    text-align: right;
    padding: 20px 0 10px 0;
  }

  .pagination {
    width: 100%;
    text-align: right;
    padding-top: 10px;
  }

  .search {
    display: flex;
    align-items: center;
    padding-top: 20px;
  }

  .search > .tip {
    font-weight: bold;
    margin-top: -2px;
  }

  .search > div {
    margin-right: 20px;
  }
</style>
<template>
  <div>
    <div class="search">
      <div class="tip">查询条件</div>
      <div>
        <label>标题：</label>
        <Input v-model="searchTitle" placeholder="标题" style="width: 120px"/>
      </div>
      <div>
        <label>发布人：</label>
        <Input v-model="searchPerson" placeholder="发布人" style="width: 100px"/>
      </div>
      <div>
        <label>发布日期：</label>
        <DatePicker :value="searchDate" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围"
                    style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="oper-group">
      <Button type="primary">查询</Button>
      <Button type="primary">清除条件</Button>
      <Button type="primary">恢复公告</Button>
      <Button type="primary">彻底删除</Button>
    </div>
    <Table border ref="selection" :columns="columns1" :data="data1"></Table>
    <div class="pagination">
      <Page :total="100" show-total show-sizer show-elevator/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NoticeDeleted",
    data() {
      return {
        searchTitle: '',
        searchPerson: '',
        searchDate: [],
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },{
            title: '重要性描述',
            key: 'description',
            align: 'center'
          }, {
            title: '标题',
            key: 'title',
            align: 'center'
          }, {
            title: '发布人',
            key: 'publisher',
            align: 'center'
          }, {
            title: '发布日期',
            key: 'releaseDate',
            align: 'center'
          }, {
            title: '状态',
            key: 'status',
            align: 'center'
          }, {
            title: '操作',
            key: 'operate',
            align: 'center',
            render: (h, params) => {
              return h('a',{
                style: {
                  color: '#2d8cf0',
                  marginRight: '5px'
                },
                on: {
                  click: () => {

                  }
                }
              },'查看')
            }
          }
        ],
        data1: [
          {
            description: '重要',
            title: '关于SS的决定',
            publisher: 'abc',
            releaseDate: '20180302',
            status: '审核成功'
          }, {
            description: '普通',
            title: '放假',
            publisher: 'abc',
            releaseDate: '20180302',
            status: '待审核'
          }, {
            description: '重要',
            title: '放假',
            publisher: 'abc',
            releaseDate: '20180302',
            status: '审核失败'
          }
        ]
      }
    }
  }
</script>




