import { Asset } from '../types/Asset';
import { BottomBar } from './BottomBar';
import { MediaGrid } from './MediaGrid';
import { sortOption } from '../types/sortOption';
import { TopBar } from './TopBar';
import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  assets?: Array<Asset>;
  isModal: Boolean;
  loading: Boolean;
  onSortChange: (value: sortOption) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const StyledContainer = styled.div`
  background-color: #111;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledMediaGridContainer = styled.div`
  flex: 1;
`;

export const MediaLibrary = ({ assets = [], isModal, loading, onSortChange, searchQuery, setSearchQuery }: Props) => {
  const [selectedAssets, setSelectedAssets] = useState<Array<string>>([]);

  function onSelect(_id: string) {
    setSelectedAssets([_id]);
    // @TODO: select multiple with shift or control :)
    // const newSelectedAssets = [...selectedAssets];
    // const index = selectedAssets.indexOf(_id);

    // if (index > -1) {
    //   newSelectedAssets.splice(index, 1);
    // } else {
    //   newSelectedAssets.push(_id);
    // }

    // setSelectedAssets(newSelectedAssets);
  }

  return (
    <StyledContainer>
      <TopBar onSortChange={onSortChange} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <StyledMediaGridContainer>
        <MediaGrid assets={assets} onSelect={onSelect} selectedAssets={selectedAssets} />
      </StyledMediaGridContainer>
      <BottomBar loading={loading} isModal={isModal} />
    </StyledContainer>
  );
};
