import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-size: 2em;

  padding: 10px;
  border-bottom: 1px solid #d8d8d8;

  background: linear-gradient(to top, #ffffff 0%, #efefef 100%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.14);
`;

const Row = styled.div`
  height: 30px;
  display: flex;

  cursor: pointer;
`;

const Column = styled.div<{ percent: string }>`
  min-width: 0;

  flex: 1 1 ${props => props.percent};

  display: flex;
  justify-content: center;
  align-items: center;

  :not(:first-child) {
    margin-left: 20px;
  }
`;

const TextWrapper = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  line-height: 1.5;
`;

interface Props {
  index: number;
  id: string;
  name: string;
  price: number;
  note: string;
}

const OrderItem: FC<Props> = ({ index, id, name, price, note }) => {
  const history = useHistory();
  const handleRowClick = () => {
    history.push(`/order/${id}`);
  };

  return (
    <>
      <Wrapper>
        <Row data-testid="row" onClick={handleRowClick}>
          <Column percent="10%">
            <TextWrapper data-testid="no">{index + 1}</TextWrapper>
          </Column>
          <Column percent="30%">
            <TextWrapper data-testid="name">{name}</TextWrapper>
          </Column>
          <Column percent="15%">
            <TextWrapper data-testid="price">
              {price.toLocaleString()}
            </TextWrapper>
          </Column>
          <Column percent="45%">
            <TextWrapper data-testid="note">{note}</TextWrapper>
          </Column>
        </Row>
      </Wrapper>
    </>
  );
};

export default OrderItem;
