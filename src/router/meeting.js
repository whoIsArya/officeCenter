import MeetingManage from '@/components/Meeting/MeetingManage';
import MeetingApply from '@/components/Meeting/MeetingApply';
import MeetingVerify from '@/components/Meeting/MeetingVerify';
import MeetingSave from '@/components/Meeting/MeetingSave';
import MeetingSearch from '@/components/Meeting/MeetingSearch';
import MeetingPlan from '@/components/Meeting/MeetingPlan';


const meetingModule = [
  {
    path: 'meeting_manage',
    name: 'meeting_manage',
    component: MeetingManage
  }, {
    path: 'meeting_apply',
    name: 'meeting_apply',
    component: MeetingApply
  }, {
    path: 'meeting_verify',
    name: 'meeting_verify',
    component: MeetingVerify
  }, {
    path: 'meeting_save',
    name: 'meeting_save',
    component: MeetingSave
  }, {
    path: 'meeting_search',
    name: 'meeting_search',
    component: MeetingSearch
  }, {
    path: 'meeting_plan',
    name: 'meeting_plan',
    component: MeetingPlan
  }
]
export default meetingModule;
