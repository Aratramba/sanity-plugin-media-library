import { Asset } from '../types/Asset';
import { BottomBar } from './BottomBar';
import { MediaGrid } from './MediaGrid';
import { MediaList } from './MediaList';
import { SortOption } from '../types/SortOption';
import { TopBar } from './TopBar';
import { ViewTypes } from '../types/ViewTypes';
import React, { MouseEvent, useState } from 'react';
import styled from 'styled-components';
import { Card, Text, Box } from '@sanity/ui';
import { ToolType } from '../types/ToolType';
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
  setIsDraggingMediaItem: (value: Boolean) => void;
  setSearchQuery: (value: string) => void;
  setSelectedAssets: (value: Array<Asset>) => void;
  mode?: ToolType;
}

const StyledContainer = styled.div`
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
  setIsDraggingMediaItem,
  setSearchQuery,
  setSelectedAssets,
}: Props) => {
  const [viewType, setViewType] = useState<ViewTypes>('grid');

  function onMediaItemClick(e: MouseEvent, asset: Asset) {
    const indexInSelectedAssets = selectedAssets.indexOf(asset);

    if (!isAssetSource && e.shiftKey && selectedAssets.length > 0) {
      const startIndex = assets.indexOf(asset);
      const endIndex = assets.indexOf(selectedAssets[0]);
      const indexes = [startIndex, endIndex].sort((a, b) => (a > b ? 1 : -1));

      const newSelectedAssets = [...assets].slice(indexes[0], indexes[1] + 1);
      return setSelectedAssets(newSelectedAssets);
    }

    if (!isAssetSource && (e.ctrlKey, e.metaKey) && selectedAssets.length > 0) {
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

  function onDragStart(asset: Asset) {
    if (!selectedAssets.includes(asset)) {
      setSelectedAssets([...selectedAssets, asset]);
    }
  }

  const onDoubleClick = (asset: Asset) =>
    isAssetSource ? (handleSelect ? handleSelect([asset]) : () => {}) : onEdit(asset);

  const ViewElement = viewType === 'grid' ? MediaGrid : MediaList;

  return (
    <StyledContainer>
      <TopBar
        onSortChange={onSortChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setViewType={setViewType}
        viewType={viewType}
      />
      <StyledFlexGrowContainer>
        <StyledMediaGridContainer>
          {!Boolean(assets.length) && !loading ? (
            <Box padding={3} id="noContent">
              <Card padding={[3, 3, 4]} radius={2} shadow={1}>
                <Text size={3}>No assets found</Text>
              </Card>
            </Box>
          ) : (
            <ViewElement
              assets={assets}
              onDoubleClick={onDoubleClick}
              onDragStart={onDragStart}
              onMediaItemClick={onMediaItemClick}
              selectedAssets={selectedAssets}
              setIsDraggingMediaItem={setIsDraggingMediaItem}
            />
          )}
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
