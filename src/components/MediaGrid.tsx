import { Asset } from '../types/Asset';
import { Icon } from './Icon';
import React, { MouseEvent } from 'react';
import styled from 'styled-components';

interface Props {
  assets?: Array<Asset>;
  canSelectMultipleAssets: Boolean;
  onDoubleClick: (asset: Asset) => void;
  selectedAssets: Array<Asset>;
  setSelectedAssets: (value: Array<Asset>) => void;
}

interface AssetWithSelectedAndOnClick extends Asset {
  onClick: (e: MouseEvent) => void;
  onDoubleClick: () => void;
  selected?: Boolean;
}

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 40px;
`;

const StyledMediaItem = styled.div<{ selected?: Boolean }>`
  align-items: center;
  background-color: #333;
  border-radius: 2px;
  border: ${({ selected }) => (selected ? 'solid 4px #FFE900' : '0')};
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 150px;
  justify-content: center;
  line-height: 1.2;
  margin: 0 15px 15px 0;
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
    fill: #666;
    height: 24px;
    margin: 0 0 8px;
    width: 24px;
  }
`;

export const MediaGrid = ({
  assets = [],
  canSelectMultipleAssets,
  onDoubleClick,
  selectedAssets,
  setSelectedAssets,
}: Props) => {
  function onClick(e: MouseEvent, asset: Asset) {
    const indexInSelectedAssets = selectedAssets.indexOf(asset);

    if (canSelectMultipleAssets && e.shiftKey && selectedAssets.length > 0) {
      const startIndex = assets.indexOf(asset);
      const endIndex = assets.indexOf(selectedAssets[0]);
      const indexes = [startIndex, endIndex].sort((a, b) => (a > b ? 1 : -1));

      const newSelectedAssets = [...assets].slice(indexes[0], indexes[1] + 1);
      return setSelectedAssets(newSelectedAssets);
    }

    if (canSelectMultipleAssets && (e.ctrlKey, e.metaKey) && selectedAssets.length > 0) {
      if (indexInSelectedAssets > -1) {
        const newSelectedAssets = [...selectedAssets];
        newSelectedAssets.splice(indexInSelectedAssets, 1);
        return setSelectedAssets(newSelectedAssets);
      } else {
        const newSelectedAssets = Array.from(new Set([...selectedAssets, asset]));
        return setSelectedAssets(newSelectedAssets);
      }
    }

    if (indexInSelectedAssets > -1) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets([asset]);
    }
  }

  return (
    <StyledContainer>
      {assets.map((asset) => {
        const Element = asset._type === 'sanity.imageAsset' ? ImageItem : FileItem;
        return (
          <Element
            key={asset._id}
            onClick={(e) => onClick(e, asset)}
            onDoubleClick={() => onDoubleClick(asset)}
            selected={selectedAssets.findIndex(({ _id }) => _id === asset._id) > -1}
            {...asset}
          />
        );
      })}
    </StyledContainer>
  );
};

const ImageItem = ({ alt, onClick, onDoubleClick, selected, url }: AssetWithSelectedAndOnClick) => (
  <StyledMediaItem selected={selected} onClick={(e) => onClick(e)} onDoubleClick={onDoubleClick}>
    <img alt={alt} src={`${url}?w=150&h=150&fit=crop&auto=format&q=80`} />
  </StyledMediaItem>
);

const FileItem = ({ originalFilename, onClick, onDoubleClick, selected }: AssetWithSelectedAndOnClick) => (
  <StyledMediaItem selected={selected} onClick={(e) => onClick(e)} onDoubleClick={onDoubleClick}>
    <Icon type="file" />
    <div>{originalFilename}</div>
  </StyledMediaItem>
);
