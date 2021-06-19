import React, { ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { Dialog } from '@sanity/ui';

interface Props {
  children: ReactNode;
  onClose: () => void;
  title?: string;
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

export const Modal = ({ children, title, onClose }: Props) => {
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
    <>
      <StyledOverlay onClick={onClose} />
      <Dialog id="media-library-dialog" onClose={onClose} cardShadow={2} width={1} header={title}>
        {children}
      </Dialog>
    </>
  );
};
