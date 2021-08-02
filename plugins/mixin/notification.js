import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';

const Notify = (nType, nMessage = '') => new Noty({
  theme:'mint',
  type: nType,
  layout: 'topRight',
  text: ((typeof (nMessage) !== 'undefined') && (nMessage !== '')) ? nMessage : (nType === 'success' ? 'Successfully Done!' : 'Something Wrong Happened!'),
  timeout: 1500
}).show();

window.Notify = Notify;
