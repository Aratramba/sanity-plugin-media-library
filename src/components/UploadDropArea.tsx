import React, { DragEvent, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { Heading } from '@sanity/ui';
import { UploadIcon } from '@sanity/icons';

interface Props {
  children: ReactNode;
  disabled?: Boolean;
  loading: Boolean;
  onUpload: (files: FileList) => void;
}

const StyledContainer = styled.div`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

const StyledContentContainer = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  padding: 40px;
  pointer-events: none;
  position: absolute;
  text-align: center;
  top: 0;
  width: 100%;
  z-index: 999999;
`;

export const UploadDropArea = ({ children, disabled, loading, onUpload }: Props) => {
  const [isDraggedOn, setIsDraggedOn] = useState<Boolean>(false);

  const onDragLeave = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDraggedOn(false);
  };

  const onDragOver = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDraggedOn(true);
  };

  function onDrop(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    setIsDraggedOn(false);

    if (!e.dataTransfer.files.length) {
      return;
    }

    onUpload(e.dataTransfer.files);
  }

  return (
    <StyledContainer onDragEnter={onDragOver} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}>
      {isDraggedOn && !loading && (
        <StyledContentContainer>
          <UploadIcon style={{ width: 32, height: 32 }} />
          <Heading as="h3">Drop your files here to upload them</Heading>
        </StyledContentContainer>
      )}
      {children}
    </StyledContainer>
  );
};
