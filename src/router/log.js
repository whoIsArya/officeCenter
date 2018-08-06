import LogWrite from '@/components/Log/LogWrite';
import LogMy from '@/components/Log/LogMy';
import LogCheck from '@/components/Log/LogCheck';

const logModule = [
  {
    path: 'log_write',
    name: 'log_write',
    component: LogWrite
  },{
    path: 'log_my',
    name: 'log_my',
    component: LogMy
  },{
    path: 'log_check',
    name: 'log_check',
    component: LogCheck
  }
]
export default logModule;
