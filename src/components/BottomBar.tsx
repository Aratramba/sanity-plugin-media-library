import { Asset } from '../types/Asset';
import { Button } from './Button';
import { Loader } from './Loader';
import React, { Fragment } from 'react';
import styled from 'styled-components';

interface BottomBarProps {
  handleSelect?: (selectedAssets: Array<Asset>) => void;
  isAssetSource: Boolean;
  loading: Boolean;
  onCancel?: () => void;
  onDelete: (value: Array<Asset> | null) => void;
  onEdit: (value: Asset | null) => void;
  selectedAssets: Array<Asset>;
}

const StyledContainer = styled.div`
  align-items: center;
  border-top: solid 1px ${({ theme }) => theme.bottomBarBorderColor};
  display: flex;
  justify-content: space-between;
  padding: 40px;
`;

const StyledItemsContainer = styled.div`
  display: flex;

  & > :not(:last-child) {
    margin: 0 20px 0 0;
  }
`;

export const BottomBar = ({
  handleSelect,
  isAssetSource,
  loading,
  onCancel,
  onDelete,
  onEdit,
  selectedAssets,
}: BottomBarProps) => {
  const selectedAsset = selectedAssets.length > 0 ? selectedAssets[0] : null;

  const onView = () => (selectedAsset ? window.open(selectedAsset.url, '_blank') : null);

  return (
    <StyledContainer>
      <div>{loading && <Loader />}</div>

      <StyledItemsContainer>
        {isAssetSource ? (
          <Fragment>
            <Button secondary onClick={onCancel ? onCancel : () => {}}>
              Cancel
            </Button>
            <Button disabled={!selectedAsset} onClick={() => (handleSelect ? handleSelect(selectedAssets) : null)}>
              Select
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Button disabled={selectedAssets.length === 0} secondary onClick={() => onDelete(selectedAssets)}>
              Delete Asset{selectedAssets.length > 1 ? 's' : ''}
            </Button>
            <Button disabled={!selectedAsset || selectedAssets.length > 1} secondary onClick={onView}>
              View Asset
            </Button>
            <Button disabled={!selectedAsset || selectedAssets.length > 1} onClick={() => onEdit(selectedAsset)}>
              Edit Asset
            </Button>
          </Fragment>
        )}
      </StyledItemsContainer>
    </StyledContainer>
  );
};
