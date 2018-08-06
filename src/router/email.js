import EmailWrite from '@/components/Email/EmailWrite';
import EmailIn from '@/components/Email/EmailIn';
import EmailSend from '@/components/Email/EmailSend';
import EmailRecycle from '@/components/Email/EmailRecycle';
import EmailDraft from '@/components/Email/EmailDraft';

const emailModule = [
  {
    path: 'email_write',
    name: 'email_write',
    component: EmailWrite
  },{
    path: 'email_in',
    name: 'email_in',
    component: EmailIn
  },{
    path: 'email_send',
    name: 'email_send',
    component: EmailSend
  },{
    path: 'email_recycle',
    name: 'email_recycle',
    component: EmailRecycle
  },{
    path: 'email_draft',
    name: 'email_draft',
    component: EmailDraft
  }
]
export default emailModule;
