import BbsCenter from '@/components/Bbs/BbsCenter';
import BbsMy from '@/components/Bbs/BbsMy';
import BbsVerify from '@/components/Bbs/BbsVerify';
import BbsMyCollection from '@/components/Bbs/BbsMyCollection';

const bbsModule = [
  {
    path: 'bbs_center',
    name: 'bbs_center',
    component: BbsCenter
  },{
    path: 'bbs_my',
    name: 'bbs_my',
    component: BbsMy
  },{
    path: 'bbs_verify',
    name: 'bbs_verify',
    component: BbsVerify
  },{
    path: 'bbs_my_collection',
    name: 'bbs_my_collection',
    component: BbsMyCollection
  }
]
export default bbsModule;
