import { Asset } from '../types/Asset';
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
  border: ${({ selected }) => (selected ? 'solid 4px #FFE900' : '0')};
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
  height: 150px;
  margin: 0 15px 15px 0;
  overflow: hidden;
  position: relative;
  width: 150px;

  & img {
    height: 100%;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }
`;

export const MediaGrid = ({ assets = [], onSelect, selectedAssets }: Props) => (
  <StyledContainer>
    {assets.map((asset) => (
      <MediaItem
        key={asset._id}
        onSelect={() => onSelect(asset)}
        selected={selectedAssets.findIndex(({ _id }) => _id === asset._id) > -1}
        {...asset}
      />
    ))}
  </StyledContainer>
);

const MediaItem = ({ alt, onSelect, selected, url }: AssetWithSelectedAndOnSelect) => (
  <StyledMediaItem selected={selected} onClick={() => onSelect()}>
    <img alt={alt} src={`${url}?w=150&h=150&fit=crop&auto=format&q=80`} />
  </StyledMediaItem>
);
