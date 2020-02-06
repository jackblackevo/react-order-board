import styled, { css } from 'styled-components';

const buttonStyles = css`
  display: inline-block;
  width: 32%;
  padding: 6px 0;

  border-radius: 6px;

  color: #ffffff;
  font-size: 1.5em;
  text-decoration: none;

  cursor: pointer;

  display: flex;
  justify-content: center;

  :focus {
    outline: 0;
  }
`;

export const CancelButton = styled.input.attrs({ type: 'button' })`
  ${buttonStyles}

  text-shadow: 0px 1px 0px #1570cd;

  border: 1px solid #337fed;
  box-shadow: inset 0px 1px 0px 0px #97c4fe;

  background: linear-gradient(to bottom, #3d94f6 5%, #1e62d0 100%);
  background-color: #3d94f6;

  :hover {
    background: linear-gradient(to bottom, #1e62d0 5%, #3d94f6 100%);
    background-color: #1e62d0;
  }
`;

export const DeleteButton = styled.input.attrs({ type: 'button' })`
  ${buttonStyles}

  text-shadow: 0px 1px 0px #810e05;

  border: 1px solid #d02718;
  box-shadow: inset 0px 1px 0px 0px #f5978e;

  background: linear-gradient(to bottom, #f24537 5%, #c62d1f 100%);
  background-color: #f24537;

  :hover {
    background: linear-gradient(to bottom, #c62d1f 5%, #f24537 100%);
    background-color: #c62d1f;
  }
`;

export const SubmitButton = styled.input.attrs({ type: 'submit' })`
  ${buttonStyles}

  text-shadow: 0px 1px 0px #528009;

  border: 1px solid #74b807;
  box-shadow: inset 0px 1px 0px 0px #a4e271;

  background: linear-gradient(to bottom, #89c403 5%, #77a809 100%);
  background-color: #89c403;

  :hover {
    background: linear-gradient(to bottom, #77a809 5%, #89c403 100%);
    background-color: #77a809;
  }
`;
