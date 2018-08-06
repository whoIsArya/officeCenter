import ScheduleMy from '@/components/Schedule/ScheduleMy';
import ScheduleOrganization from '@/components/Schedule/ScheduleOrganization';
import ScheduleCheck from '@/components/Schedule/ScheduleCheck';
import ScheduleCompany from '@/components/Schedule/ScheduleCompany';
import ScheduleResume from '@/components/Schedule/ScheduleResume';
import ScheduleRemindSet from '@/components/Schedule/ScheduleRemindSet';

const scheduleModule = [
  {
    path: 'schedule_my',
    name: 'schedule_my',
    component: ScheduleMy
  },{
    path: 'schedule_check',
    name: 'schedule_check',
    component: ScheduleCheck
  },{
    path: 'schedule_organization',
    name: 'schedule_organization',
    component: ScheduleOrganization
  },{
    path: 'schedule_company',
    name: 'schedule_company',
    component: ScheduleCompany
  },{
    path: 'schedule_resume',
    name: 'schedule_resume',
    component: ScheduleResume
  },{
    path: 'schedule_remind_set',
    name: 'schedule_remind_set',
    component: ScheduleRemindSet
  }
]
export default scheduleModule;
