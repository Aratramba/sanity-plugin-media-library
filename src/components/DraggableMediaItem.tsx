import { AssetType } from '../types/Asset';
import { Icon } from './Icon';
import React, { DragEvent, ReactNode, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  _type: AssetType;
  children: ReactNode;
  onDragEnd: () => void;
  onDragStart: () => void;
  selectedAmount?: number;
  url: string;
}

interface MediaDragPreviewProps {
  _type: AssetType;
  selectedAmount: number;
  url: string;
}

const StyledContainer = styled.div`
  position: relative;
`;

const StyledMediaDragPreviewContainer = styled.div`
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  z-index: -1;
`;

const StyledMediaDragPreview = styled.div`
  background-color: #000;
  border-radius: 2px;
  border: solid 4px #ffe900;
  height: 150px;
  overflow: hidden;
  position: relative;
  width: 150px;

  & > * {
    border: 0 !important;
  }
`;

const StyledSelectedAmount = styled.div`
  align-items: center;
  background-color: #ffe900;
  border-radius: 50%;
  color: #000;
  display: flex;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 16px;
  font-weight: 600;
  height: 50px;
  justify-content: center;
  left: 50%;
  line-height: 1.1;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  z-index: 2;
`;

const StyledIconContainer = styled.div`
  align-items: center;
  background-color: #333;
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: center;
  padding: 20px;
  width: 150px;

  & svg {
    fill: #666;
    height: 75%;
    width: 75%;
  }
`;

export const DraggableMediaItem = ({ children, onDragStart, onDragEnd, selectedAmount, _type, url }: Props) => {
  const mediaDragPreviewRef = useRef<HTMLDivElement>(null);

  function onDragStartHandler(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.effectAllowed = 'linkMove';
    onDragStart();

    if (mediaDragPreviewRef?.current) {
      e.dataTransfer.setDragImage(mediaDragPreviewRef?.current, 0, 0);
    }
  }

  function onDragEndHandler() {
    onDragEnd();
  }

  return (
    <StyledContainer draggable onDragStart={onDragStartHandler} onDragEnd={onDragEndHandler}>
      {children}
      <StyledMediaDragPreviewContainer ref={mediaDragPreviewRef}>
        <MediaDragPreview selectedAmount={selectedAmount || 1} _type={_type} url={url} />
      </StyledMediaDragPreviewContainer>
    </StyledContainer>
  );
};

const MediaDragPreview = ({ selectedAmount, _type, url }: MediaDragPreviewProps) => (
  <StyledMediaDragPreview>
    {_type === 'sanity.imageAsset' ? (
      <img src={`${url}?w=150&h=150&fit=crop&auto=format&q=80`} />
    ) : (
      <StyledIconContainer>
        <Icon type="file" />
      </StyledIconContainer>
    )}
    <StyledSelectedAmount>{selectedAmount}</StyledSelectedAmount>
  </StyledMediaDragPreview>
);
