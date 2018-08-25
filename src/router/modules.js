import Meeting from '@/components/Meeting/Meeting';
import Car from '@/components/Car/Car';
import News from '@/components/News/News';
import Notice from '@/components/Notice/Notice';
import Log from '@/components/Log/Log';
import Bbs from '@/components/Bbs/Bbs';
import Email from '@/components/Email/Email';
import Person from '@/components/Person/Person';
import Activity from '@/components/Activity/Activity';
import Schedule from '@/components/Schedule/Schedule';
import Document from '@/components/Document/Document';
import meetingModule from '@/router/meeting';
import carModule from '@/router/car';
import newsModule from '@/router/news';
import noticeModule from '@/router/notice';
import logModule from '@/router/log';
import bbsModule from '@/router/bbs';
import emailModule from '@/router/email';
import personModule from '@/router/person';
import activityModule from '@/router/activity';
import scheduleModule from '@/router/schedule';
import documentModule from '@/router/document';

const moudelArr = [
  {
    path: 'meeting',
    name: 'meeting',
    component: Meeting,
    children: meetingModule,
    redirect: { name: 'meeting_manage' }
  }, {
    path: 'car',
    name: 'car',
    component: Car,
    children: carModule,
    redirect: { name: 'car_back' }
  }, {
    path: 'news',
    name: 'news',
    component: News,
    children: newsModule,
    redirect: { name: 'news_manage' }
  }, {
    path: 'notice',
    name: 'notice',
    component: Notice,
    children: noticeModule,
    redirect: { name: 'notice_public' }
  }, {
    path: 'log',
    name: 'log',
    component: Log,
    children: logModule,
    redirect: { name: 'log_write' }
  }, {
    path: 'bbs',
    name: 'bbs',
    component: Bbs,
    children: bbsModule,
    redirect: { name: 'bbs_center' }
  }, {
    path: 'email',
    name: 'email',
    component: Email,
    children: emailModule,
    redirect: { name: 'email_write' }
  }, {
    path: 'person',
    name: 'person',
    component: Person,
    children: personModule,
    redirect: { name: 'person_my_status' }
  }, {
    path: 'activity',
    name: 'activity',
    component: Activity,
    children: activityModule,
    redirect: { name: 'activity_edit' }
  }, {
    path: 'schedule',
    name: 'schedule',
    component: Schedule,
    children: scheduleModule,
    redirect: { name: 'schedule_my' }
  },{
    path: 'document',
    name: 'document',
    component: Document,
    children: documentModule,
    redirect: { name: 'document_my' }
  }
]
export default moudelArr;
