<style scoped>
  .box{
    display: flex;
    align-items: flex-start;
  }
  .box>.menu{
    width: 240px;
    flex: 0;
  }
  .box>.right{
    box-sizing: border-box;
    padding:0 10px;
    width: 82%;
  }
</style>
<template>
  <div class="box" style="height: 100%">
    <div class="menu" style="height: 100%; background-color: #495060">
      <Menu theme="dark" @on-select="goPage" :active-name="activemenu">
        <MenuGroup title="行政办公中心">

          <Submenu :name="p.name" v-for="p in navList" :key="p.name">
            <template slot="title">
              {{p.menu}}
            </template>
            <MenuItem v-for="item in p.children" :key="item.name" :name="item.name">{{item.menu}}</MenuItem>
          </Submenu>
        </MenuGroup>
      </Menu>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activemenu: 'meeting_manage',
        navList: [
          {
            name: 'meeting',
            menu: '会议管理',
            children: [
              {
                name: 'meeting_manage',
                menu: '会议室管理'
              },{
                name: 'meeting_apply',
                menu: '会议申请'
              },{
                name: 'meeting_verify',
                menu: '会议审核'
              },{
                name: 'meeting_save',
                menu: '会议维护'
              },{
                name: 'meeting_search',
                menu: '会议查询'
              },{
                name: 'meeting_plan',
                menu: '会议室一周安排'
              }
            ]
          },{
            name: 'car',
            menu: '出车管理',
            children: [
              {
                name: 'car_back',
                menu: '用车归还'
              },{
                name: 'car_manage',
                menu: '车辆管理'
              },{
                name: 'car_driver',
                menu: '司机管理'
              },{
                name: 'car_apply',
                menu: '出车申请'
              },{
                name: 'car_verify',
                menu: '出车审核'
              },{
                name: 'car_plan',
                menu: '出车安排'
              },{
                name: 'car_save',
                menu: '出车信息维护'
              },{
                name: 'car_search',
                menu: '出车查询'
              }
            ]
          },{
            name: 'news',
            menu: '校内新闻',
            children: [
              {
                name: 'news_manage',
                menu: '新闻管理'
              },{
                name: 'news_search',
                menu: '查阅新闻'
              }
            ]
          },{
            name: 'notice',
            menu: '公告管理',
            children: [
              {
                name: 'notice_public',
                menu: '公告发布'
              },{
                name: 'notice_verify',
                menu: '公告审核'
              },{
                name: 'notice_check',
                menu: '公告查看'
              },{
                name: 'notice_save',
                menu: '公告维护'
              },{
                name: 'notice_deleted',
                menu: '已删除公告'
              },{
                name: 'notice_manage',
                menu: '敏感词管理'
              }
            ]
          },{
            name: 'log',
            menu: '工作日志',
            children: [
              {
                name: 'log_write',
                menu: '填写今日工作日志'
              },{
                name: 'log_my',
                menu: '我的日志'
              },{
                name: 'log_check',
                menu: '日志查看'
              }
            ]
          },{
            name: 'bbs',
            menu: '校园论坛',
            children: [
              {
                name: 'bbs_center',
                menu: '论坛中心'
              },{
                name: 'bbs_my',
                menu: '我的帖子'
              },{
                name: 'bbs_verify',
                menu: '发帖审核'
              },{
                name: 'bbs_my_collection',
                menu: '我的收藏'
              }
            ]
          },{
            name: 'email',
            menu: '邮件系统',
            children: [
              {
                name: 'email_write',
                menu: '写信'
              },{
                name: 'email_in',
                menu: '收件箱'
              },{
                name: 'email_send',
                menu: '发件箱'
              },{
                name: 'email_recycle',
                menu: '回收站'
              },{
                name: 'email_draft',
                menu: '草稿箱'
              }
            ]
          },{
            name: 'person',
            menu: '人员去向',
            children: [
              {
                name: 'person_my_status',
                menu: '我的状态'
              },{
                name: 'person_status_check',
                menu: '状态查看'
              }
            ]
          },{
            name: 'activity',
            menu: '校园重大活动',
            children: [
              {
                name: 'activity_edit',
                menu: '行事历编辑'
              },{
                name: 'activity_check',
                menu: '行事历查看'
              }
            ]
          },{
            name: 'schedule',
            menu: '日程安排',
            children: [
              {
                name: 'schedule_my',
                menu: '我的日程'
              },{
                name: 'schedule_check',
                menu: '日程查看'
              },{
                name: 'schedule_organization',
                menu: '机构周工作安排'
              },{
                name: 'schedule_company',
                menu: '单位周工作安排'
              },{
                name: 'schedule_resume',
                menu: '工作简历'
              },{
                name: 'schedule_remind_set',
                menu: '日程提醒设置'
              }
            ]
          },{
            name:'document',
            menu:'公文管理',
            children: [
              {
                name:'document_my',
                menu:'我的公文'
              },{
                name:'document_public',
                menu:'公文发布'
              },{
                name:'document_verify',
                menu:'公文审核'
              }
            ]
          }
        ]
      }
    },
    methods: {
      goPage: function (str) {
        console.log(str)
        this.$router.push({name: str});
      }
    },
    mounted() {
      console.log(this.$route);
      this.activemenu = this.$route.name;
    }
  }
</script>
