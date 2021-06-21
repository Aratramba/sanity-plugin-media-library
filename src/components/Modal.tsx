import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, Layer } from '@sanity/ui';

interface Props {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  width?: number;
}

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

export const Modal = ({ children, title, onClose, width = 1 }: Props) => {
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
    <Layer>
      <StyledOverlay onClick={onClose} />
      <Dialog id="media-library-dialog" onClose={onClose} cardShadow={2} width={width} header={title}>
        {children}
      </Dialog>
    </Layer>
  );
};
