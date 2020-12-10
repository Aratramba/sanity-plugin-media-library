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
  onEdit: (value: Asset | null) => void;
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

export const MediaLibrary = ({
  assets = [],
  isModal,
  loading,
  onEdit,
  onSortChange,
  searchQuery,
  setSearchQuery,
}: Props) => {
  const [selectedAssets, setSelectedAssets] = useState<Array<Asset>>([]);

  function onSelect(asset: Asset) {
    // @TODO: select multiple with shift or control :)
    const index = selectedAssets.indexOf(asset);

    if (index > -1) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets([asset]);
    }
  }

  return (
    <StyledContainer>
      <TopBar onSortChange={onSortChange} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <StyledMediaGridContainer>
        <MediaGrid assets={assets} onSelect={onSelect} selectedAssets={selectedAssets} />
      </StyledMediaGridContainer>
      <BottomBar loading={loading} isModal={isModal} onEdit={onEdit} selectedAssets={selectedAssets} />
    </StyledContainer>
  );
};
