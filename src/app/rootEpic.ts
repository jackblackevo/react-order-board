import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import {
  addOrderEpic,
  deleteOrderEpic,
  updateOrderEpic
} from '../features/ordersList/ordersSlice';
import { postOrder, deleteOrder, patchOrder } from '../api/orders';

const rootEpic = combineEpics(addOrderEpic, deleteOrderEpic, updateOrderEpic);

export const dependencies = {
  postOrderAPI: (...args: Parameters<typeof postOrder>) =>
    from(postOrder(...args)),
  deleteOrderAPI: (...args: Parameters<typeof deleteOrder>) =>
    from(deleteOrder(...args)),
  patchOrderAPI: (...args: Parameters<typeof patchOrder>) =>
    from(patchOrder(...args))
};

export type Dependencies = typeof dependencies;

export default rootEpic;
