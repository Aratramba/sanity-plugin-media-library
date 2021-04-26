import { Icon } from './Icon';
import React, { DragEvent, ReactNode, useState } from 'react';
import styled from 'styled-components';

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
  background-color: ${({ theme }) => theme.uploadDropAreaBackgroundColor};
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

  & svg {
    fill: ${({ theme }) => theme.uploadDropAreaIconColor};
    height: 56px;
    margin: 0 0 16px;
    width: 56px;
  }
`;

const StyledTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
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
          <Icon type="upload" />
          <StyledTitle>Drop your files here to upload them</StyledTitle>
        </StyledContentContainer>
      )}
      {children}
    </StyledContainer>
  );
};
