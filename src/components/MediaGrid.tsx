import { Asset } from '../types/Asset';
import { Icon } from './Icon';
import React from 'react';
import styled from 'styled-components';

interface Props {
  assets?: Array<Asset>;
  onSelect: (asset: Asset) => void;
  selectedAssets: Array<Asset>;
}

interface AssetWithSelectedAndOnSelect extends Asset {
  onSelect: () => void;
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

export const MediaGrid = ({ assets = [], onSelect, selectedAssets }: Props) => (
  <StyledContainer>
    {assets.map((asset) =>
      asset._type === 'sanity.imageAsset' ? (
        <ImageItem
          key={asset._id}
          onSelect={() => onSelect(asset)}
          selected={selectedAssets.findIndex(({ _id }) => _id === asset._id) > -1}
          {...asset}
        />
      ) : (
        <FileItem
          key={asset._id}
          onSelect={() => onSelect(asset)}
          selected={selectedAssets.findIndex(({ _id }) => _id === asset._id) > -1}
          {...asset}
        />
      )
    )}
  </StyledContainer>
);

const ImageItem = ({ alt, onSelect, selected, url }: AssetWithSelectedAndOnSelect) => (
  <StyledMediaItem selected={selected} onClick={() => onSelect()}>
    <img alt={alt} src={`${url}?w=150&h=150&fit=crop&auto=format&q=80`} />
  </StyledMediaItem>
);

const FileItem = ({ originalFilename, onSelect, selected }: AssetWithSelectedAndOnSelect) => (
  <StyledMediaItem selected={selected} onClick={() => onSelect()}>
    <Icon type="file" />
    <div>{originalFilename}</div>
  </StyledMediaItem>
);
