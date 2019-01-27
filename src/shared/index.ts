import { MiddlewareAPI } from 'redux';
import { addObserverType } from '../core/createWatchman';

type TwatchmanWrap = {
  addObserver: addObserverType | null
  store: MiddlewareAPI | null
}


export let watchmanWrap: TwatchmanWrap = {
  addObserver: null,
  store: null
};

// set WatchmanWarp
export const activeWatchman = (addObserver: addObserverType, store: MiddlewareAPI)=>{
  Object.assign(watchmanWrap, { addObserver, store});
}

// call function after activeWatchman
export const withActive = (handler:Function, key?: keyof TwatchmanWrap)=>{
  return function(...arg:any[]){
    if(watchmanWrap.addObserver && watchmanWrap.store){
        return handler(...arg, key? watchmanWrap[key]: undefined);
    } else {
      console.error('please run');
    }
  }
}
// async thorw error, make every safe
export const safeBox = (handler:AsyncFunction)=>{
  return handler().catch((e)=>{return e})
}