import { Asset } from '../types/Asset';
import { BottomBar } from './BottomBar';
import { MediaGrid } from './MediaGrid';
import { SortOption } from '../types/SortOption';
import { TopBar } from './TopBar';
import React from 'react';
import styled from 'styled-components';

interface Props {
  assets?: Array<Asset>;
  handleSelect?: (selectedAssets: Array<Asset>) => void;
  isAssetSource: Boolean;
  loading: Boolean;
  onClose?: () => void;
  onDelete: (value: Array<Asset> | null) => void;
  onEdit: (value: Asset | null) => void;
  onSortChange: (value: SortOption) => void;
  searchQuery: string;
  selectedAssets: Array<Asset>;
  setSearchQuery: (value: string) => void;
  setSelectedAssets: (value: Array<Asset>) => void;
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
  handleSelect,
  isAssetSource,
  loading,
  onClose,
  onDelete,
  onEdit,
  onSortChange,
  searchQuery,
  selectedAssets,
  setSearchQuery,
  setSelectedAssets,
}: Props) => {
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
          <MediaGrid
            assets={assets}
            onDoubleClick={(asset: Asset) =>
              isAssetSource ? (handleSelect ? handleSelect([asset]) : () => {}) : onEdit(asset)
            }
            onSelect={onSelect}
            selectedAssets={selectedAssets}
          />
        </StyledMediaGridContainer>
      </StyledFlexGrowContainer>
      <BottomBar
        handleSelect={handleSelect}
        isAssetSource={isAssetSource}
        loading={loading}
        onCancel={onClose}
        onDelete={onDelete}
        onEdit={onEdit}
        selectedAssets={selectedAssets}
      />
    </StyledContainer>
  );
};
