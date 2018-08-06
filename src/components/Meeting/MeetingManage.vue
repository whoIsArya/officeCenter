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
</style>
<template>
    <div>
      <div class="oper-group">
        <Button type="primary">添加会议室</Button>
        <Button type="primary">删除会议室</Button>
      </div>
      <Table border ref="selection" :columns="columns1" :data="data1"></Table>
      <div class="pagination">
        <Page :total="100" show-total show-sizer show-elevator/>
      </div>
    </div>
</template>

<script>
    export default {
      name: "MeetingManage",
      data(){
        return {
          columns1: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },{
              title: '会议室名称',
              key: 'name',
              align: 'center'
            },{
              title: '容量(人)',
              key: 'capacity',
              align: 'center'
            },{
              title: '地址',
              key: 'address',
              align: 'center'
            },{
              title: '配置',
              key: 'config',
              align: 'center'
            },{
              title: '操作',
              key: 'operate',
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
                },'修改')
              }
            }
          ],
          data1: [
            {
              name: '第一会议室',
              capacity: '200',
              address: '学堂101',
              config: '投影'
            },{
              name: '第二会议室',
              capacity: '100',
              address: '学堂102',
              config: '投影 电脑'
            }
          ]
        }
      },
      mounted(){
        var obj = {
          page: 1,
          limit: 10
        }

          // this.$http({
          //   method: 'get',
          //   params: obj,
          //   // transformRequest:[function () {
          //   //   return JSON.stringify(obj)
          //   // }],
          //   url: 'Meeting/GetList'
          // }).then((res) => {
          //   console.log(res)
          // }).catch((res) => {
          //   console.log(res);
          // })


          this.$http.post('Meeting/AddList',obj).then(function (res) {
            console.log(res)
          })
      }
    }
</script>

