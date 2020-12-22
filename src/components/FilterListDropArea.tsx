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
  ${({ shouldHighlight, theme }) => (shouldHighlight ? ` & button { color: ${theme.filterListActiveColor}; } ` : '')}
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
