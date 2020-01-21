import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { RootState } from '../../app/rootReducer';

const glowingKeyframes = keyframes`
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
`;

const GlowingWrapper = styled.div<{ isVisible: boolean }>`
  position: relative;

  z-index: 1;

  :before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;

    width: calc(100% + 4px);
    height: calc(100% + 4px);

    background: linear-gradient(
      45deg,
      #ff7300,
      #fffb00,
      #00ffd5,
      #ff7300,
      #fffb00,
      #00ffd5,
      #ff7300,
      #fffb00,
      #00ffd5,
      #ff7300,
      #fffb00,
      #00ffd5
    );
    background-size: 400%;
    border-radius: 10px;

    z-index: -1;
    filter: blur(5px);

    opacity: ${props => (props.isVisible ? 1 : 0)};
    transition: opacity 0.3s ease-in-out;
    animation: ${glowingKeyframes} 20s linear infinite;
  }
`;

const Button = styled.div`
  padding: 20px;

  border: 10px solid #f7f7f7;
  border-radius: 5px;

  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1), inset 0 0 2px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to top, #efefef 0%, #ffffff 100%);

  font-size: 2em;
  text-align: center;

  cursor: pointer;
  user-select: none;

  :active {
    background: linear-gradient(to top, #ffffff 0%, #efefef 100%);
  }
`;

const NewOrderButton: FC = () => {
  const orderList = useSelector((state: RootState) => state.order.list);

  const history = useHistory();
  const handleButtonClick = () => {
    history.push('/new');
  };

  return (
    <GlowingWrapper isVisible={orderList.length === 0}>
      <Button data-testid="button" onClick={handleButtonClick}>
        New Order
      </Button>
    </GlowingWrapper>
  );
};

export default NewOrderButton;
