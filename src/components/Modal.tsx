import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  onClose: () => void;
}

const StyledContainer = styled.div`
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
`;

const StyledOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const StyledModal = styled.div`
  background-color: #111;
  box-shadow: 0 2px 10px #000;
  left: 50%;
  max-width: 300px;
  padding: 40px;
  position: absolute;
  top: 200px;
  transform: translateX(-50%);
  width: 100%;
  z-index: 2;
`;

export const Modal = ({ children, onClose }: Props) => (
  <StyledContainer>
    <StyledOverlay onClick={onClose} />
    <StyledModal>{children}</StyledModal>
  </StyledContainer>
);
