import { Asset } from '../types/Asset';
import { Button } from './Button';
import { Loader } from './Loader';
import React, { Fragment } from 'react';
import styled from 'styled-components';

interface BottomBarProps {
  isModal: Boolean;
  loading: Boolean;
  onEdit: (value: Asset | null) => void;
  selectedAssets: Array<Asset>;
}

const StyledContainer = styled.div`
  align-items: center;
  border-top: solid 1px #222;
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

export const BottomBar = ({ isModal, loading, onEdit, selectedAssets }: BottomBarProps) => {
  const selectedAsset = selectedAssets.length > 0 ? selectedAssets[0] : null;

  const onView = () => (selectedAsset ? window.open(selectedAsset.url, '_blank') : null);

  return (
    <StyledContainer>
      <div>{loading && <Loader />}</div>

      <StyledItemsContainer>
        {isModal ? (
          <Fragment>
            <Button secondary onClick={() => alert(selectedAsset)}>
              Cancel
            </Button>
            <Button disabled={!selectedAsset} onClick={() => alert(selectedAsset)}>
              Insert
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Button disabled={!selectedAsset} secondary onClick={() => console.log(selectedAsset)}>
              Delete Image
            </Button>
            <Button disabled={!selectedAsset} secondary onClick={onView}>
              View Image
            </Button>
            <Button disabled={!selectedAsset} onClick={() => onEdit(selectedAsset)}>
              Edit Image
            </Button>
          </Fragment>
        )}
      </StyledItemsContainer>
    </StyledContainer>
  );
};
