import { withActive } from '../shared';

const all = withActive((af: AsyncFunction[])=>{
  return Promise.all(af.map(hd=>hd()));
});

export default all;