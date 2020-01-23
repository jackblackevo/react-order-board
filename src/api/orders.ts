import { v4 } from 'uuid';

interface OrderResource {
  id: string;
  creationDate: number;
  modificationDate: number;
  name: string;
  price: number;
  note: string;
}

const orderResourceMap = new Map<string, OrderResource>();

export const postOrder = async (
  order: Pick<OrderResource, 'name' | 'price' | 'note'>
) => {
  const orderID = v4();
  const orderResource = {
    ...order,
    id: orderID,
    creationDate: new Date().getTime(),
    modificationDate: new Date().getTime()
  };

  orderResourceMap.set(orderID, orderResource);

  return orderResource;
};

export const postOrders = async (
  orders: Pick<OrderResource, 'name' | 'price' | 'note'>[]
) => Promise.all(orders.map(postOrder));

export const getOrder = async (orderID: string) =>
  orderResourceMap.get(orderID)!;

export const getOrders = async () => Array.from(orderResourceMap.values());

export const patchOrder = async (
  order: Omit<OrderResource, 'creationDate' | 'modificationDate'>
) => {
  const { id: orderID } = order;
  const orderResource = orderResourceMap.get(orderID)!;
  const modifiedOrderResource = {
    ...orderResource,
    ...order,
    modificationDate: new Date().getTime()
  };

  orderResourceMap.set(orderID, modifiedOrderResource);

  return modifiedOrderResource;
};

export const patchOrders = async (
  orders: Omit<OrderResource, 'creationDate' | 'modificationDate'>[]
) => Promise.all(orders.map(patchOrder));

export const deleteOrder = async (orderID: string) => {
  orderResourceMap.delete(orderID);
};

export const deleteOrders = async (orderIDs: string[]) => {
  await Promise.all(orderIDs.map(deleteOrder));
};

export default {
  postOrder,
  postOrders,
  getOrder,
  getOrders,
  patchOrder,
  patchOrders,
  deleteOrder,
  deleteOrders
};
