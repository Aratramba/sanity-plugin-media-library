import React, { DragEvent, ReactNode, useState } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  disabled?: Boolean;
  loading: Boolean;
  onDrop: () => void;
}

const StyledContainer = styled.div<{ shouldHighlight: Boolean }>`
  position: relative;

  &::after {
    content: '';
    display: block;
    opacity: ${({ shouldHighlight }) => (shouldHighlight ? '.1' : '0')};
    transition: opacity 0.05s;
    pointer-events: none;
    position: absolute;
    top: -6px;
    right: -6px;
    bottom: -6px;
    left: -6px;
    background: currentColor;
    border-radius: 5px;
  }
`;

export const FilterListDropArea = ({ children, disabled, loading, onDrop }: Props) => {
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

  function handleOnDrop(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    setIsDraggedOn(false);
    onDrop();
  }

  return (
    <StyledContainer
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={handleOnDrop}
      shouldHighlight={isDraggedOn && !loading}
    >
      {children}
    </StyledContainer>
  );
};
