import { v4 } from 'uuid';
import {
  addOrder,
  deleteOrder,
  updateOrder,
  reducer,
  makeOrderByIDSelector
} from '../orderSlice';

jest.mock('uuid');

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
  });

  describe('reducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, { type: 'anyType' })).toEqual({ list: [] });
    });

    it('should handle addOrder', () => {
      const v4Mock = (v4 as jest.Mock<string>).mockImplementation(
        () => 'an-uuid'
      );
      const getTimeMock = jest
        .spyOn(Date.prototype, 'getTime')
        .mockImplementation(() => 1579000000000);

      expect(
        reducer(
          { list: [] },
          {
            type: 'order/addOrder',
            payload: {
              name: 'test order',
              price: 999,
              note: 'something to note'
            }
          }
        )
      ).toEqual({
        list: [
          {
            id: v4(),
            creationDate: 1579000000000,
            modificationDate: 1579000000000,
            name: 'test order',
            price: 999,
            note: 'something to note'
          }
        ]
      });

      v4Mock.mockReset();
      getTimeMock.mockRestore();
    });

    it('should handle deleteOrder', () => {
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
            type: 'order/deleteOrder',
            payload: 'an-id'
          }
        )
      ).toEqual({ list: [] });
    });

    it('should handle updateOrder', () => {
      const getTimeMock = jest
        .spyOn(Date.prototype, 'getTime')
        .mockImplementation(() => 1579999999999);

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
            type: 'order/updateOrder',
            payload: {
              id: 'an-id',
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

      getTimeMock.mockRestore();
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
