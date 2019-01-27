const set = (state,action)=>{
  return {
    contacts: action.payload
  }
}
const del = (state,action)=>{
  const contacts = state.contacts;
  const index = contacts.findIndex(contact=>contact.id === action.payload);
  if(index !== -1) {
    contacts.splice(index, 1);
    return {
      contacts: [...contacts]
    }
  }
  return state;
}
const edit = (state,action)=>{
  const contacts = state.contacts;
  const index = contacts.findIndex(contact=>contact.id === action.payload);
  if(index !== -1) {
    contacts.splice(index, 1, action.payload);
    return {
      contacts: [...contacts]
    }
  }
  return {
    contacts: [...contacts, action.payload]
  }
}
const reducer = (state,action)=>{
  const handler = {
    set,
    edit,
    del
  }
  if(handler[action.type]) return handler[action.type](state,action);
  return state
}
export default reducer;