import NewsManage from '@/components/News/NewsManage';
import NewsSearch from '@/components/News/NewsSearch';

const newsModule = [
  {
    path: 'news_manage',
    name: 'news_manage',
    component: NewsManage
  },{
    path: 'news_search',
    name: 'news_search',
    component: NewsSearch
  }
]
export default newsModule;
