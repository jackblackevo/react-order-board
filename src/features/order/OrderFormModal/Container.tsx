import styled, { css, keyframes } from 'styled-components';

const shakeKeyframes = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

const shakeAnimation = css`
  animation: ${shakeKeyframes} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
`;

const Container = styled.div<{ isShakeModal: boolean }>`
  padding: 0 15px 20px;

  max-width: 640px;
  width: 80%;
  max-height: 400px;

  background-color: #fff;
  border-radius: 4px;

  ${props => (props.isShakeModal ? shakeAnimation : '')}
`;

export default Container;
