import { Asset } from '../types/Asset';
import { Button } from './Button';
import { Icon } from './Icon';
import { LabelWithInput } from './LabelWithInput';
import { Loader } from './Loader';
import { Modal } from './Modal';
import client from 'part:@sanity/base/client';
import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';

interface Props {
  asset: Asset;
  loading: Boolean;
  onClose: () => void;
  onSaveComplete: () => void;
  setLoading: (value: Boolean) => void;
}

const StyledFormContainer = styled.form`
  & > :not(:last-child) {
    border-bottom: solid 1px #222;
    margin: 0 0 20px;
    padding: 0 0 20px;
  }
`;

const StyledImageInfoContainer = styled.div`
  display: flex;
`;

const StyledThumbnailContainer = styled.div`
  border-radius: 2px;
  display: block;
  flex-shrink: 0;
  height: 100px;
  margin: 0 20px 0 0;
  overflow: hidden;
  position: relative;
  width: 100px;
`;

const StyledImage = styled.img`
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  top: 0;
  width: 100%;
`;

const StyledFile = styled.div`
  align-items: center;
  background-color: #333;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  line-height: 1.2;
  padding: 20px;
  position: absolute;
  top: 0;
  width: 100%;

  & svg {
    fill: #666;
    height: 24px;
    width: 24px;
  }
`;

const StyledInfoContainer = styled.div`
  color: #aaa;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;

  & strong {
    color: #fff;
    display: block;
    font-weight: 500;
    margin: 0 0 1em;
  }
`;

const StyledInputsContainer = styled.div`
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

export const AssetModal = ({ asset, loading, onClose, onSaveComplete, setLoading }: Props) => {
  const { _createdAt, _id, _type, alt, extension, metadata, originalFilename, size, tags, url } = asset;
  const { height, width } = metadata?.dimensions || {};
  const [localAlt, setLocalAlt] = useState<string>(alt || '');
  const [localTags, setLocalTags] = useState<string>((tags || []).join(',') || '');

  const isChanged = localAlt !== (alt || '') || localTags !== (tags?.join(',') || '');

  async function handleSubmit(e: FormEvent) {
    try {
      if (loading) {
        return;
      }

      setLoading(true);
      e.preventDefault();

      if (!isChanged) {
        return onClose();
      }

      const alt = localAlt;
      const tags = localTags.split(',').map((v) => v.trim());

      await client.patch(_id).set({ alt, tags }).commit();
      onSaveComplete();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <StyledFormContainer onSubmit={handleSubmit}>
        <StyledImageInfoContainer>
          <StyledThumbnailContainer>
            {_type === 'sanity.imageAsset' ? (
              <StyledImage alt={alt} src={`${url}?w=100&h=100&fit=crop&auto=format&q=80`} />
            ) : (
              <StyledFile>
                <Icon type="file" />
              </StyledFile>
            )}
          </StyledThumbnailContainer>
          <StyledInfoContainer>
            <strong>{originalFilename}</strong>
            {formatDate(_createdAt)}
            <br />
            {width && height && (
              <Fragment>
                `${width} x ${height}`<br />
              </Fragment>
            )}
            {extension.toUpperCase()}, {formatSize(size)}
          </StyledInfoContainer>
        </StyledImageInfoContainer>

        <StyledInputsContainer>
          {_type === 'sanity.imageAsset' && (
            <LabelWithInput
              label="Alt text"
              onChange={setLocalAlt}
              placeholder={!localAlt ? 'No alt text yet...' : undefined}
              value={localAlt}
            />
          )}
          <LabelWithInput
            label="Tags"
            onChange={setLocalTags}
            placeholder={!localTags ? 'No tags yet...' : undefined}
            value={localTags}
          />
        </StyledInputsContainer>

        <StyledButtonsContainer>
          <Button disabled={!isChanged || loading}>Save Changes</Button>
          <Button secondary onClick={() => onClose()}>
            Cancel
          </Button>
          {loading && <Loader />}
        </StyledButtonsContainer>
      </StyledFormContainer>
    </Modal>
  );
};

function formatSize(size: number) {
  const kb = Math.round(size / 1000);
  const mb = kb > 1000 ? size / 1000000 : null;
  const roundedMb = mb ? Math.round(mb * 100) / 100 : null;
  return roundedMb ? `${roundedMb} mb` : `${kb} kb`;
}

function formatDate(date: string) {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth() - 1]} ${d.getDate()}, ${d.getFullYear()}`;
}
