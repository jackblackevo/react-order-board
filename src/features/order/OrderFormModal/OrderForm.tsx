import React, { useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useParams,
  useRouteMatch,
  useHistory,
  Redirect
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import {
  addOrder,
  updateOrder,
  deleteOrder,
  makeOrderByIDSelector
} from '../orderSlice';
import { RootState } from '../../../app/rootReducer';
import ErrorMessage from './ErrorMessage';
import { Input, TextArea } from './fields';
import { CancelButton, DeleteButton, SubmitButton } from './buttons';

const selectOrderByID = makeOrderByIDSelector();

const Row = styled.div`
  min-height: 57px;

  margin-bottom: 2px;
`;

const Control = styled.div`
  margin-top: 20px;

  display: flex;
  justify-content: space-between;
`;

interface FormValues {
  name: string;
  price: string;
  note: string;
}

interface Props {
  onUserInteractedChange: (isUserInteracted: boolean) => void;
}

const OrderForm: FC<Props> = ({ onUserInteractedChange }) => {
  const { orderID } = useParams();
  const newOrderMatch = useRouteMatch({ path: '/new' });
  const {
    handleSubmit: makeSubmitHandler,
    register,
    errors,
    formState: { dirty }
  } = useForm<FormValues>({ mode: 'onBlur' });

  const order = useSelector((state: RootState) =>
    selectOrderByID(state, orderID || '')
  );

  useEffect(() => {
    onUserInteractedChange(dirty);
  }, [onUserInteractedChange, dirty]);

  const history = useHistory();
  const handleClose = () => {
    history.push('/');
  };

  const dispatch = useDispatch();
  const handleSubmit = makeSubmitHandler(({ name, price, note = '' }) => {
    if (orderID) {
      dispatch(updateOrder({ id: orderID, name, price: Number(price), note }));
    } else {
      dispatch(addOrder({ name, price: Number(price), note }));
    }
    handleClose();
  });

  const handleDelete = () => {
    if (orderID) {
      dispatch(deleteOrder(orderID));
    }
    handleClose();
  };

  const { name, price, note } = order || { name: '', price: 0, note: '' };

  if (!newOrderMatch && !order) {
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Input
          data-testid="name"
          name="name"
          placeholder="訂單名稱"
          autoComplete="off"
          defaultValue={name}
          ref={register({ required: '請輸入訂單名稱' })}
          isError={!!errors.name}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </Row>

      <Row>
        <Input
          data-testid="price"
          name="price"
          placeholder="訂單金額"
          type="number"
          defaultValue={price || undefined}
          ref={register({
            required: '請輸入訂單金額',
            min: { value: 1, message: '請輸入大於 1 的數字' },
            max: {
              value: 999999999,
              message: '請輸入小於 999,999,999 的數字'
            }
          })}
          isError={!!errors.price}
        />
        {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
      </Row>

      <Row>
        <TextArea
          data-testid="note"
          name="note"
          placeholder="備註"
          rows={3}
          defaultValue={note}
          ref={register}
        />
      </Row>

      <Control>
        <CancelButton data-testid="cancel" value="取消" onClick={handleClose} />
        {orderID && (
          <DeleteButton
            data-testid="delete"
            value="刪除"
            onClick={handleDelete}
          />
        )}
        <SubmitButton data-testid="submit" value="送出" />
      </Control>
    </form>
  );
};

export default OrderForm;
