import CarBack from '@/components/Car/CarBack';
import CarManage from '@/components/Car/CarManage';
import CarDriver from '@/components/Car/CarDriver';
import CarApply from '@/components/Car/CarApply';
import CarVerify from '@/components/Car/CarVerify';
import CarPlan from '@/components/Car/CarPlan';
import CarSave from '@/components/Car/CarSave';
import CarSearch from '@/components/Car/CarSearch';

const carModule = [
  {
    path: 'car_back',
    name: 'car_back',
    component: CarBack
  },{
    path: 'car_manage',
    name: 'car_manage',
    component: CarManage
  },{
    path: 'car_driver',
    name: 'car_driver',
    component: CarDriver
  },{
    path: 'car_apply',
    name: 'car_apply',
    component: CarApply
  },{
    path: 'car_verify',
    name: 'car_verify',
    component: CarVerify
  },{
    path: 'car_plan',
    name: 'car_plan',
    component: CarPlan
  },{
    path: 'car_save',
    name: 'car_save',
    component: CarSave
  },{
    path: 'car_search',
    name: 'car_search',
    component: CarSearch
  }
]
export default carModule;
