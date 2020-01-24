import { TestScheduler } from 'rxjs/testing';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { dependencies } from '../../../app/rootEpic';
import {
  addOrderFulfilled,
  deleteOrderFulfilled,
  updateOrderFulfilled,
  addOrder,
  deleteOrder,
  updateOrder,
  apiError,
  reducer,
  addOrderEpic,
  deleteOrderEpic,
  updateOrderEpic,
  makeOrderByIDSelector
} from '../orderSlice';

describe('order slice', () => {
  describe('actions', () => {
    it('should return addOrder action', () => {
      expect(
        addOrder({ name: 'test order', price: 999, note: 'something to note' })
      ).toEqual({
        type: 'order/addOrder',
        payload: { name: 'test order', price: 999, note: 'something to note' }
      });
    });

    it('should return deleteOrder action', () => {
      expect(deleteOrder('an-id')).toEqual({
        type: 'order/deleteOrder',
        payload: 'an-id'
      });
    });

    it('should return updateOrder action', () => {
      expect(
        updateOrder({
          id: 'an-id',
          name: 'test order',
          price: 999,
          note: 'something to note'
        })
      ).toEqual({
        type: 'order/updateOrder',
        payload: {
          id: 'an-id',
          name: 'test order',
          price: 999,
          note: 'something to note'
        }
      });
    });

    it('should return apiError action', () => {
      const error = new Error('something wrong');

      expect(apiError(error)).toEqual({
        type: 'order/apiError',
        payload: error
      });
    });

    it('should return addOrderFulfilled action', () => {
      expect(
        addOrderFulfilled({
          id: 'an-id',
          name: 'test order',
          price: 999,
          note: 'something to note',
          creationDate: 1579000000000,
          modificationDate: 1579000000000
        })
      ).toEqual({
        type: 'order/addOrderFulfilled',
        payload: {
          id: 'an-id',
          name: 'test order',
          price: 999,
          note: 'something to note',
          creationDate: 1579000000000,
          modificationDate: 1579000000000
        }
      });
    });

    it('should return deleteOrderFulfilled action', () => {
      expect(deleteOrderFulfilled('an-id')).toEqual({
        type: 'order/deleteOrderFulfilled',
        payload: 'an-id'
      });
    });

    it('should return updateOrderFulfilled action', () => {
      expect(
        updateOrderFulfilled({
          id: 'an-id',
          name: 'test order',
          price: 999,
          note: 'something to note',
          creationDate: 1579000000000,
          modificationDate: 1579000000000
        })
      ).toEqual({
        type: 'order/updateOrderFulfilled',
        payload: {
          id: 'an-id',
          name: 'test order',
          price: 999,
          note: 'something to note',
          creationDate: 1579000000000,
          modificationDate: 1579000000000
        }
      });
    });
  });

  describe('reducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, { type: 'anyType' })).toEqual({ list: [] });
    });

    it('should handle addOrderFulfilled', () => {
      expect(
        reducer(
          { list: [] },
          {
            type: 'order/addOrderFulfilled',
            payload: {
              id: 'an-id',
              creationDate: 1579000000000,
              modificationDate: 1579000000000,
              name: 'test order',
              price: 999,
              note: 'something to note'
            }
          }
        )
      ).toEqual({
        list: [
          {
            id: 'an-id',
            creationDate: 1579000000000,
            modificationDate: 1579000000000,
            name: 'test order',
            price: 999,
            note: 'something to note'
          }
        ]
      });
    });

    it('should handle deleteOrderFulfilled', () => {
      expect(
        reducer(
          {
            list: [
              {
                id: 'an-id',
                creationDate: 1579000000000,
                modificationDate: 1579000000000,
                name: 'test order',
                price: 999,
                note: 'something to note'
              }
            ]
          },
          {
            type: 'order/deleteOrderFulfilled',
            payload: 'an-id'
          }
        )
      ).toEqual({ list: [] });
    });

    it('should handle updateOrderFulfilled', () => {
      expect(
        reducer(
          {
            list: [
              {
                id: 'an-id',
                creationDate: 1579000000000,
                modificationDate: 1579000000000,
                name: 'test order',
                price: 999,
                note: 'something to note'
              }
            ]
          },
          {
            type: 'order/updateOrderFulfilled',
            payload: {
              id: 'an-id',
              creationDate: 1579000000000,
              modificationDate: 1579999999999,
              name: 'test order modify',
              price: 1,
              note: 'something to note modify'
            }
          }
        )
      ).toEqual({
        list: [
          {
            id: 'an-id',
            creationDate: 1579000000000,
            modificationDate: 1579999999999,
            name: 'test order modify',
            price: 1,
            note: 'something to note modify'
          }
        ]
      });
    });
  });

  describe('epics', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should handle addOrder', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const actionInput$ = hot('a', {
          a: {
            type: 'order/addOrder',
            payload: { name: 'order name', price: 111, note: '' }
          }
        });
        const stateInput$ = hot('s', {
          s: {
            order: {
              list: [] as {
                id: string;
                creationDate: number;
                modificationDate: number;
                name: string;
                price: number;
                note: string;
              }[]
            }
          }
        });

        const action$ = new ActionsObservable(actionInput$);
        const state$ = new StateObservable(stateInput$, {
          order: { list: [] }
        });
        const dependenciesMock = {
          ...dependencies,
          postOrderAPI: (
            order: Parameters<typeof dependencies.postOrderAPI>[0]
          ) =>
            cold('-o', {
              o: {
                ...order,
                id: 'an-id',
                creationDate: 1579000000000,
                modificationDate: 1579000000000
              }
            })
        };

        const output$ = addOrderEpic(action$, state$, dependenciesMock);

        expectObservable(output$).toBe('-a', {
          a: {
            type: 'order/addOrderFulfilled',
            payload: {
              id: 'an-id',
              creationDate: 1579000000000,
              modificationDate: 1579000000000,
              name: 'order name',
              price: 111,
              note: ''
            }
          }
        });
      });
    });

    it('should handle deleteOrder', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const actionInput$ = hot('a', {
          a: { type: 'order/deleteOrder', payload: 'an-id' }
        });
        const stateInput$ = hot('s', {
          s: {
            order: {
              list: [] as {
                id: string;
                creationDate: number;
                modificationDate: number;
                name: string;
                price: number;
                note: string;
              }[]
            }
          }
        });

        const action$ = new ActionsObservable(actionInput$);
        const state$ = new StateObservable(stateInput$, {
          order: { list: [] }
        });
        const dependenciesMock = {
          ...dependencies,
          deleteOrderAPI: (
            _orderID: Parameters<typeof dependencies.deleteOrderAPI>[0]
          ) => cold('-o', { o: undefined })
        };

        const output$ = deleteOrderEpic(action$, state$, dependenciesMock);

        expectObservable(output$).toBe('-a', {
          a: { type: 'order/deleteOrderFulfilled', payload: 'an-id' }
        });
      });
    });

    it('should handle updateOrder', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const actionInput$ = hot('a', {
          a: {
            type: 'order/updateOrder',
            payload: {
              id: 'an-id',
              name: 'modify name',
              price: 111,
              note: 'something to note'
            }
          }
        });
        const stateInput$ = hot('s', {
          s: {
            order: {
              list: [] as {
                id: string;
                creationDate: number;
                modificationDate: number;
                name: string;
                price: number;
                note: string;
              }[]
            }
          }
        });

        const action$ = new ActionsObservable(actionInput$);
        const state$ = new StateObservable(stateInput$, {
          order: { list: [] }
        });
        const dependenciesMock = {
          ...dependencies,
          patchOrderAPI: (
            order: Parameters<typeof dependencies.patchOrderAPI>[0]
          ) =>
            cold('-o', {
              o: {
                ...order,
                creationDate: 1578888888888,
                modificationDate: 1579000000000
              }
            })
        };

        const output$ = updateOrderEpic(action$, state$, dependenciesMock);

        expectObservable(output$).toBe('-a', {
          a: {
            type: 'order/updateOrderFulfilled',
            payload: {
              id: 'an-id',
              creationDate: 1578888888888,
              modificationDate: 1579000000000,
              name: 'modify name',
              price: 111,
              note: 'something to note'
            }
          }
        });
      });
    });
  });

  describe('selectors', () => {
    it('should return same order when give same id', () => {
      const state = {
        order: {
          list: [
            {
              id: 'id-1',
              creationDate: 1579000000000,
              modificationDate: 1579000000000,
              name: 'test order 1',
              price: 999,
              note: 'something to note 1'
            },
            {
              id: 'id-2',
              creationDate: 1579000000000,
              modificationDate: 1579000000000,
              name: 'test order 2',
              price: 999,
              note: 'something to note 2'
            },
            {
              id: 'id-3',
              creationDate: 1579000000000,
              modificationDate: 1579000000000,
              name: 'test order 3',
              price: 999,
              note: 'something to note 3'
            }
          ]
        }
      };
      const selectOrderByID = makeOrderByIDSelector();

      expect(selectOrderByID(state, 'id-2')).toEqual(state.order.list[1]);
      expect(selectOrderByID(state, 'id-2')).toEqual(state.order.list[1]);
      expect(selectOrderByID(state, 'id-3')).toEqual(state.order.list[2]);
      expect(selectOrderByID(state, 'id-3')).toEqual(state.order.list[2]);
    });
  });
});
