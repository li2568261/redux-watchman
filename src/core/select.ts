import { MiddlewareAPI } from 'redux';
import { withActive } from '../shared';

const select = withActive((handler: <S = any, R = any>(state: S)=>R, store: MiddlewareAPI)=>{
  return new Promise((resolve,reject)=>{
    resolve(handler(store.getState()));
  })
}, 'store');

export default select;