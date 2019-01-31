import { all, put, select, take, takeEvery } from 'redux-watchman';
const requestMock = function(data){
  return Promise.resolve(data);
}
const contactFactory = function(name = 'lee', phone = '123'){
  return {
    id: Math.random() * 100,
    name,
    phone
  }
}
const query = async function(){
  await take('query');

  const mock = [
    contactFactory('lee', '123'),
    contactFactory('zhao', '123')
  ]
  const payload = await requestMock(mock);

  await put({ type: 'set', payload})
}

const edit = async function(){
  await takeEvery('editAsync', async function(action){
    let mockData = action.payload;
    if(!action.payload.id){
      mockData = {...mockData, id: Math.random()}
    }
    const payload = await requestMock(mockData);
    await put({ type: 'edit', payload})
  })
}

const del = async function(){
  await takeEvery('delAsync', async function(action){
    if(!action.payload.id)return
    const result = await requestMock(true);
    if(result)await put({ type: 'del', payload: action.payload.id})
  })
}
const pop = async function(){
  await takeEvery('popAsync', async function(action){
    const contacts = await select(function(state){return state.contacts});
    const last = contacts[contacts.length - 1];
    const result = await requestMock(true);
    if(result)await put({ type: 'del', payload: last.id})
  })
}

const root = async function(){
  await all([ query, edit, del, pop ])
}

export default root;

