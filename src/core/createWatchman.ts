import { Middleware , AnyAction} from 'redux';
import { activeWatchman } from '../shared';

export type addObserverType = (actionType: string,resolve: Function)=>void;


const createWatchman = ()=>{

  const sugar:ISugar = {
    observer:{}
  };


  /**
   * @description check observer, if has take action resolve relative take promise;
   * @param action 
   */
  const emitAction = (action: AnyAction)=>{
    const checkResult = sugar.observer[action.type];
    if(checkResult){
      checkResult.forEach(handler => handler(action));
      sugar.observer[action.type] = [];
    }
    return checkResult;
  }

  /**
   * @param actionType take action, add observer
   * @param resolve take Promise'resolve function
   */
  const addObserver = (actionType: string,resolve: Function)=>{
    if(!sugar.observer[actionType]) sugar.observer[actionType] = [];
    (sugar.observer[actionType] as Function[]).push(resolve);
  }
  let run:(handler: AsyncFunction)=>void = ()=>{
    console.error('applymiddleware before run');
  };
  
  const sugarMiddleware:Middleware = store=>{
    API.run = (handler: AsyncFunction)=>{
      activeWatchman( addObserver, store )
      handler();
    }
    return next=>(action:AnyAction)=>{
      if(!emitAction(action))next(action);
    }
  }

  /**
   * run handler, can asynchronous to intermediate
   * @param handler 
   */
  
  const API = {
    sugarMiddleware,
    run
  }
  
  return API
}


export default createWatchman;
