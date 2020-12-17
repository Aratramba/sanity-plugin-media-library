import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  full?: Boolean;
  onClose: () => void;
}

const StyledContainer = styled.div`
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2000;
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

const StyledModal = styled.div<{ full?: Boolean }>`
  background-color: #111;
  box-shadow: 0 2px 10px #000;
  height: ${({ full }) => (full ? 'calc(100% - 200px)' : 'auto')};
  left: 50%;
  max-width: ${({ full }) => (full ? 'calc(100% - 200px)' : '500px')};
  padding: 40px;
  position: absolute;
  top: ${({ full }) => (full ? '50%' : '200px')};
  transform: ${({ full }) => (full ? 'translate(-50%, -50%)' : 'translateX(-50%)')};
  width: 100%;
  z-index: 2;
`;

export const Modal = ({ children, full, onClose }: Props) => {
  useEffect(() => {
    function onKeyDown(e: any) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown, false);
    return () => window.removeEventListener('keydown', onKeyDown, false);
  }, []);

  return (
    <StyledContainer>
      <StyledOverlay onClick={onClose} />
      <StyledModal full={full}>{children}</StyledModal>
    </StyledContainer>
  );
};
