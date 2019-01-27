import { Middleware, AnyAction } from 'redux';
interface AsyncFunction<T = any>{
  (...arg:any[]):Promise<T>
}

interface ISelectFun<T extends object = any>{
  (store:T):any
}

export function createWatchman (): { run(task: AsyncFunction):void, sugarMiddleware: Middleware};
export function all(asf: AsyncFunction[]): Promise<any[]>;
export function select<T = any>(selectFuc: ISelectFun): Promise<T>;
export function take(actionName: string): Promise<AnyAction>;
export function put(action: AnyAction): Promise<AnyAction>;
export function takeEvery(actionType: string, handler:(AnyAction:AnyAction)=>Promise<any>): Promise<void>;