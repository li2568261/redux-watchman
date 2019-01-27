import { withActive, safeBox } from '../shared';
import take from './take';
interface IAnyAction {
  type: string
  [str: string] : any
}

const takeEvery = withActive(async function(actionType: string,handler:(AnyAction:IAnyAction)=>Promise<any>){
  while(true){
    const action = await take(actionType);
    await safeBox(()=>handler(action));
  }
});

export default takeEvery;