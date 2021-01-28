import { Asset } from '../types/Asset';
import { DraggableMediaItem } from './DraggableMediaItem';
import { formatDate, formatSize } from '../shared/utils';
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

interface MediaRowProps extends Asset {
  onClick: (e: MouseEvent) => void;
  onDoubleClick: () => void;
  selected?: Boolean;
}

const StyledHeader = styled.header`
  align-items: center;
  border-bottom: solid 1px ${({ theme }) => theme.mediaListBorderColor};
  display: grid;
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 14px;
  font-weight: 500;
  grid-gap: 15px;
  grid-template-columns: 1fr 4fr 1fr 1fr 1fr 0.5fr 0.5fr 1fr;
  line-height: 1.1;
  padding: 20px 40px;
`;

const StyledRow = styled.div<{ selected?: Boolean }>`
  align-items: center;
  border-left: ${({ selected, theme }) => (selected ? `solid 2px ${theme.mediaListSelectedBorderColor}` : '0')};
  cursor: pointer;
  display: grid;
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 14px;
  font-weight: 400;
  grid-gap: 15px;
  grid-template-columns: 1fr 4fr 1fr 1fr 1fr 0.5fr 0.5fr 1fr;
  line-height: 1.1;
  padding: 20px 40px;

  &:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.mediaListBorderColor};
  }

  & > :nth-child(2) {
    font-weight: 500;
  }
`;

const StyledThumbnailContainer = styled.div`
  border-radius: ${({ theme }) => theme.appBorderRadius};
  display: block;
  flex-shrink: 0;
  height: 100px;
  margin: 0 20px 0 0;
  overflow: hidden;
  position: relative;
  width: 100px;
`;

const StyledImage = styled.img`
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  top: 0;
  width: 100%;
`;

const StyledFile = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.mediaItemBackgroundColor};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  line-height: 1.2;
  padding: 20px;
  position: absolute;
  top: 0;
  width: 100%;

  & svg {
    fill: ${({ theme }) => theme.mediaItemIconColor};
    height: 24px;
    width: 24px;
  }
`;

export const MediaList = ({
  assets = [],
  onDoubleClick,
  onDragStart,
  onMediaItemClick,
  selectedAssets,
  setIsDraggingMediaItem,
}: Props) => (
  <div>
    <MediaListHeader />
    {assets.map((asset) => (
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
        <MediaRow
          key={asset._id}
          onClick={(e) => onMediaItemClick(e, asset)}
          onDoubleClick={() => onDoubleClick(asset)}
          selected={selectedAssets.findIndex(({ _id }) => _id === asset._id) > -1}
          {...asset}
        />
      </DraggableMediaItem>
    ))}
  </div>
);

const MediaListHeader = () => (
  <StyledHeader>
    <div />
    <div>Title</div>
    <div>Alt</div>
    <div>Tags</div>
    <div>Dimensions</div>
    <div>Type</div>
    <div>Size</div>
    <div>Created at</div>
  </StyledHeader>
);

const MediaRow = ({
  _createdAt,
  _type,
  alt,
  extension,
  metadata,
  onClick,
  onDoubleClick,
  originalFilename,
  selected,
  size,
  tags = [],
  title,
  url,
}: MediaRowProps) => {
  const { height, width } = metadata?.dimensions || {};

  return (
    <StyledRow selected={selected} onClick={(e) => onClick(e)} onDoubleClick={onDoubleClick}>
      <div>
        <StyledThumbnailContainer>
          {_type === 'sanity.imageAsset' ? (
            <StyledImage alt={alt} src={`${url}?w=100&h=100&fit=crop&auto=format&q=80`} loading="lazy" />
          ) : (
            <StyledFile>
              <Icon type="file" />
            </StyledFile>
          )}
        </StyledThumbnailContainer>
      </div>
      <div>{title || originalFilename}</div>
      <div>{alt}</div>
      <div>{tags.join(', ')}</div>
      <div>{width && height && `${width} x ${height}`}</div>
      <div>{extension.toUpperCase()}</div>
      <div>{formatSize(size)}</div>
      <div>{formatDate(_createdAt)}</div>
    </StyledRow>
  );
};
