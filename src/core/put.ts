import { MiddlewareAPI, AnyAction } from 'redux';
import { withActive } from '../shared';

const put = withActive((action: AnyAction, store: MiddlewareAPI)=>{
  return new Promise((resolve,reject)=>{
    resolve(store.dispatch(action));
  })
}, 'store');

export default put;