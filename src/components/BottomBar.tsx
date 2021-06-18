import { Asset } from '../types/Asset';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Spinner, Button } from '@sanity/ui';
import { ArrowTopRightIcon, EditIcon, RemoveIcon } from '@sanity/icons';

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
      <div>{loading && <Spinner />}</div>

      <StyledItemsContainer>
        {isAssetSource ? (
          <Fragment>
            <Button mode="ghost" onClick={onCancel ? onCancel : () => {}} text="Cancel" />
            <Button
              tone="primary"
              disabled={!selectedAsset}
              onClick={() => (handleSelect ? handleSelect(selectedAssets) : null)}
              text="Select"
            />
          </Fragment>
        ) : (
          <Fragment>
            <Button
              tone="primary"
              disabled={!selectedAsset || selectedAssets.length > 1}
              onClick={() => onEdit(selectedAsset)}
              text="Edit Asset"
              icon={EditIcon}
              padding={[3, 3, 4]}
            />
            <Button
              icon={ArrowTopRightIcon}
              tone="primary"
              mode="ghost"
              disabled={!selectedAsset || selectedAssets.length > 1}
              onClick={onView}
              text="View asset"
              padding={[3, 3, 4]}
            />
            <Button
              disabled={selectedAssets.length === 0}
              tone="critical"
              icon={RemoveIcon}
              onClick={() => onDelete(selectedAssets)}
              text={`Delete Asset${selectedAssets.length > 1 ? 's' : ''}`}
              padding={[3, 3, 4]}
            />
          </Fragment>
        )}
      </StyledItemsContainer>
    </StyledContainer>
  );
};
