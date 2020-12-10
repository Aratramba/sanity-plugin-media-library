import { Asset } from '../types/Asset';
import { BottomBar } from './BottomBar';
import { MediaGrid } from './MediaGrid';
import { sortOption } from '../types/sortOption';
import { TopBar } from './TopBar';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
  assets?: Array<Asset>;
  isModal: Boolean;
  loading: Boolean;
  onDelete: (value: Array<Asset> | null) => void;
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

const StyledFlexGrowContainer = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const StyledMediaGridContainer = styled.div`
  -ms-overflow-style: none; /* IE and Edge */
  height: 100%;
  left: 0;
  overflow-y: scroll;
  position: absolute;
  scrollbar-width: none; /* Firefox */
  top: 0;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MediaLibrary = ({
  assets = [],
  isModal,
  loading,
  onDelete,
  onEdit,
  onSortChange,
  searchQuery,
  setSearchQuery,
}: Props) => {
  const [selectedAssets, setSelectedAssets] = useState<Array<Asset>>([]);

  useEffect(() => {
    setSelectedAssets([]);
  }, [assets]);

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
      <StyledFlexGrowContainer>
        <StyledMediaGridContainer>
          <MediaGrid assets={assets} onSelect={onSelect} selectedAssets={selectedAssets} />
        </StyledMediaGridContainer>
      </StyledFlexGrowContainer>
      <BottomBar
        loading={loading}
        isModal={isModal}
        onDelete={onDelete}
        onEdit={onEdit}
        selectedAssets={selectedAssets}
      />
    </StyledContainer>
  );
};
