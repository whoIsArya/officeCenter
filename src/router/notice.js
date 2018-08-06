import NoticePublic from '@/components/Notice/NoticePublic';
import NoticeVerify from '@/components/Notice/NoticeVerify';
import NoticeCheck from '@/components/Notice/NoticeCheck';
import NoticeSave from '@/components/Notice/NoticeSave';
import NoticeDeleted from '@/components/Notice/NoticeDeleted';
import NoticeManage from '@/components/Notice/NoticeManage';


const noticeModule = [
  {
    path: 'notice_public',
    name: 'notice_public',
    component: NoticePublic
  },{
    path: 'notice_verify',
    name: 'notice_verify',
    component: NoticeVerify
  },{
    path: 'notice_check',
    name: 'notice_check',
    component: NoticeCheck
  },{
    path: 'notice_save',
    name: 'notice_save',
    component: NoticeSave
  },{
    path: 'notice_deleted',
    name: 'notice_deleted',
    component: NoticeDeleted
  },{
    path: 'notice_manage',
    name: 'notice_manage',
    component: NoticeManage
  }
]
export default noticeModule;
