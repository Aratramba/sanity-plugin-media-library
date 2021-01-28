import { Asset } from '../types/Asset';
import { DraggableMediaItem } from './DraggableMediaItem';
import { Icon } from './Icon';
import React, { MouseEvent } from 'react';
import styled from 'styled-components';

interface Props {
  assets?: Array<Asset>;
  onDoubleClick: (asset: Asset) => void;
  onDragStart: (asset: Asset) => void;
  onMediaItemClick: (e: MouseEvent, asset: Asset) => void;
  selectedAssets: Array<Asset>;
  setIsDraggingMediaItem: (value: Boolean) => void;
}

interface MediaItemProps extends Asset {
  onClick: (e: MouseEvent) => void;
  onDoubleClick: () => void;
  selected?: Boolean;
}

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 40px;

  & > * {
    margin: 0 15px 15px 0;
  }
`;

const StyledMediaItem = styled.div<{ selected?: Boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.mediaItemBackgroundColor};
  border-radius: ${({ theme }) => theme.appBorderRadius};
  border: ${({ selected, theme }) => (selected ? `solid 4px ${theme.mediaGridSelectedBorderColor}` : '0')};
  color: ${({ theme }) => theme.mediaItemTextColor};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 14px;
  font-weight: 500;
  height: 150px;
  justify-content: center;
  line-height: 1.2;
  overflow: hidden;
  padding: 20px;
  position: relative;
  text-align: center;
  width: 150px;

  & img {
    height: 100%;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }

  & svg {
    fill: ${({ theme }) => theme.mediaItemIconColor};
    height: 24px;
    margin: 0 0 8px;
    width: 24px;
  }
`;

export const MediaGrid = ({
  assets = [],
  onDoubleClick,
  onDragStart,
  onMediaItemClick,
  selectedAssets,
  setIsDraggingMediaItem,
}: Props) => (
  <StyledContainer>
    {assets.map((asset) => {
      const Element = asset._type === 'sanity.imageAsset' ? ImageItem : FileItem;
      return (
        <DraggableMediaItem
          key={asset._id}
          _type={asset._type}
          onDragEnd={() => setIsDraggingMediaItem(false)}
          onDragStart={() => {
            onDragStart(asset);
            setIsDraggingMediaItem(true);
          }}
          selectedAmount={selectedAssets.length}
          url={asset.url}
        >
          <Element
            key={asset._id}
            onClick={(e) => onMediaItemClick(e, asset)}
            onDoubleClick={() => onDoubleClick(asset)}
            selected={selectedAssets.findIndex(({ _id }) => _id === asset._id) > -1}
            {...asset}
          />
        </DraggableMediaItem>
      );
    })}
  </StyledContainer>
);

const ImageItem = ({ alt, onClick, onDoubleClick, selected, url }: MediaItemProps) => (
  <StyledMediaItem selected={selected} onClick={(e) => onClick(e)} onDoubleClick={onDoubleClick}>
    <img alt={alt} src={`${url}?w=150&h=150&fit=crop&auto=format&q=80`} loading="lazy" />
  </StyledMediaItem>
);

const FileItem = ({ title, originalFilename, onClick, onDoubleClick, selected }: MediaItemProps) => (
  <StyledMediaItem selected={selected} onClick={(e) => onClick(e)} onDoubleClick={onDoubleClick}>
    <Icon type="file" />
    <div>{title || originalFilename}</div>
  </StyledMediaItem>
);
