import styled, { css } from 'styled-components';

const inputStyles = css`
  border: 1px solid #d9dadc;
  border-radius: 0;

  font-size: 1.6em;
  line-height: 1.5;
  color: #222326;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition-duration: 0.15s, 0.15s;
  transition-timing-function: ease-in-out, ease-in-out;
  transition-delay: 0s, 0s;

  :focus {
    border-color: #919496;
    outline: 0;
  }
`;

export const Input = styled.input<{ isError: boolean }>`
  ${inputStyles}

  display: block;

  width: 100%;
  height: 40px;
  padding: 6px 12px;
  background-color: #fff;

  ${props => (props.isError ? 'border-color: #eb1e32;' : '')}
`;

export const TextArea = styled.textarea`
  ${inputStyles}

  width: 100%;
  padding: 6px 12px;
  background-color: #fff;

  resize: none;
`;
