import DocumentMy from '@/components/Document/DocumentMy';
import DocumentPublic from '@/components/Document/DocumentPublic';
import DocumentVerify from '@/components/Document/DocumentVerify';

const documentModule = [
  {
    path: 'document_my',
    name: 'document_my',
    component: DocumentMy
  },{
    path: 'document_public',
    name: 'document_public',
    component: DocumentPublic
  },{
    path: 'document_verify',
    name: 'document_verify',
    component: DocumentVerify
  }
]
export default documentModule;
