import Home from '@/components/Home';
import modules from '@/router/modules';

export default {
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: { name: 'meeting_manage' }
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: modules,
      redirect: { name: 'meeting_manage' }
    }
  ]
}
