import { createStore, applyMiddleware } from 'redux';
import { createWatchman } from 'redux-watchman';
import reducer from './reducer';
import root from './sugar';
const sugar = createWatchman();
const store = createStore<{ contacts: any[]}, any, any, any>(
  reducer,
  {
    contacts: []
  },
  applyMiddleware(
    sugar.sugarMiddleware
  )
)

sugar.run(root);
const withStoreShow = (f)=>{
  f();
  return new Promise(resolve=>{
    setTimeout(()=>{
      console.log('state');
      console.log(JSON.stringify(store.getState()));
      console.log('-----------------------')
      resolve()
    }, 200);
  })
}

const run = async function(){
  await withStoreShow(()=>{
    console.log('query');
    store.dispatch({ type: 'query' })
  });
  await withStoreShow(()=>{
    console.log('editAsync');
    store.dispatch({ type: 'editAsync', payload: {name: 'wang', phone: '333'}})
  });
  await withStoreShow(()=>{
    console.log('editAsync');
    const state = store.getState();
    store.dispatch({ type: 'editAsync', payload: {id: state.contacts[0].id, name: 'll', phone: '773'}})
  });


  await withStoreShow(()=>{
    console.log('delAsync');
    const state = store.getState();
    store.dispatch({ type: 'delAsync', payload: state.contacts[0].id})
  });

  await withStoreShow(()=>{
    console.log('pop');
    store.dispatch({ type: 'popAsync' })
  });
}

run();