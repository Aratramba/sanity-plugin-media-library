import { Icon } from './Icon';
import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const StyledContainer = styled.div`
  animation: ${rotate} 1s linear infinite;
  height: 20px;
  width: 20px;

  & svg {
    fill: ${({ theme }) => theme.loaderColor};
    height: 20px;
    width: 20px;
  }
`;

export const Loader = () => (
  <StyledContainer>
    <Icon type="loader" />
  </StyledContainer>
);
