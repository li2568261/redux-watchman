import { withActive } from '../shared';
import { addObserverType } from './createWatchman';

const take = withActive((actionType: string, addObserver:addObserverType)=>{
  return new Promise((resolve,reject)=>{
    addObserver(actionType, resolve);
  })
}, 'addObserver');

export default take;