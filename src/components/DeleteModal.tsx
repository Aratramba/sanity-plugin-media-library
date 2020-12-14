import { Asset } from '../types/Asset';
import { Button } from './Button';
import { Loader } from './Loader';
import { Modal } from './Modal';
import client from 'part:@sanity/base/client';
import React from 'react';
import styled from 'styled-components';

interface Props {
  assets: Array<Asset>;
  loading: Boolean;
  handleError: (error: any) => void;
  onClose: () => void;
  onDeleteComplete: () => void;
  setLoading: (value: Boolean) => void;
}

const StyledContainer = styled.div`
  & > :not(:last-child) {
    margin: 0 0 20px;
  }
`;

const StyledButtonsContainer = styled.div`
  align-items: center;
  display: flex;

  & > :not(:last-child) {
    margin: 0 20px 0 0;
  }
`;

const StyledTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 1em;
`;

export const DeleteModal = ({ assets, loading, handleError, onClose, onDeleteComplete, setLoading }: Props) => {
  const plural = assets.length > 1;

  async function onDelete() {
    try {
      if (loading) {
        return;
      }

      setLoading(true);
      await Promise.all(assets.map(({ _id }) => client.delete(_id)));
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
      onDeleteComplete();
    }
  }

  return (
    <Modal onClose={onClose}>
      <StyledContainer>
        <StyledTitle>Are you sure you want to delete {plural ? 'these assets' : 'this asset'}?</StyledTitle>

        <StyledButtonsContainer>
          <Button disabled={loading} onClick={onDelete}>
            Delete asset{plural ? 's' : ''}
          </Button>
          <Button secondary onClick={() => onClose()}>
            Cancel
          </Button>
          {loading && <Loader />}
        </StyledButtonsContainer>
      </StyledContainer>
    </Modal>
  );
};
