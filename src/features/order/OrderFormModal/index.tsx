import React, { useState, useRef, useEffect, useCallback, FC } from 'react';
import { createPortal } from 'react-dom';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import debounce from '../../../utils/debounce';
import Overlay from './Overlay';
import Container from './Container';
import ErrorMessage from './ErrorMessage';
import OrderForm from './OrderForm';

const TopRow = styled.div`
  height: 20px;
  margin: 2px 0;

  display: flex;
  align-items: center;
`;

const OrderFormModal: FC = () => {
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [isUnSafeExit, setIsUnSafeExit] = useState(false);

  const isMountedRef = useRef(false);
  const rootElemRef = useRef(document.createElement('div'));
  useEffect(() => {
    const { current: rootElem } = rootElemRef;
    const { overflowY, position } = document.body.style;

    isMountedRef.current = true;
    document.body.appendChild(rootElem);
    document.body.style.overflowY = 'hidden';
    document.body.style.position = 'fixed';

    return () => {
      isMountedRef.current = false;
      document.body.removeChild(rootElem);
      document.body.style.overflowY = overflowY;
      document.body.style.position = position;
    };
  }, []);

  const history = useHistory();
  const handleClose = () => {
    history.push('/');
  };

  const setIsUnSafeExitFalse = useCallback(
    debounce(() => {
      if (isMountedRef.current) setIsUnSafeExit(false);
    }, 3000),
    []
  );

  const handleOverlayClick = () => {
    if (isUserInteracted) {
      setIsUnSafeExit(true);
      setIsUnSafeExitFalse();
    } else {
      handleClose();
    }
  };

  return createPortal(
    <Overlay data-testid="overlay" onClick={handleOverlayClick}>
      <Container
        onClick={event => event.stopPropagation()}
        isShakeModal={isUnSafeExit}
      >
        <TopRow>
          {isUnSafeExit && (
            <ErrorMessage>尚未送出編輯，放棄請按「取消」</ErrorMessage>
          )}
        </TopRow>
        <OrderForm onUserInteractedChange={setIsUserInteracted} />
      </Container>
    </Overlay>,
    rootElemRef.current
  );
};

export default OrderFormModal;
