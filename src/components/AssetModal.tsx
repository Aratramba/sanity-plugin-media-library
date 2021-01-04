import { Asset, Geopoint } from '../types/Asset';
import { Button } from './Button';
import { formatDate, formatSize } from '../shared/utils';
import { Icon } from './Icon';
import { LabelWithInput, LabelWithLocationInput } from './LabelWithInput';
import { Loader } from './Loader';
import { Modal } from './Modal';
import { assetFields } from '../config';
import client from 'part:@sanity/base/client';
import React, { Fragment, FormEvent, useState } from 'react';
import styled from 'styled-components';

interface Props {
  asset: Asset;
  loading: Boolean;
  handleError: (error: any) => void;
  onClose: () => void;
  onSaveComplete: () => void;
  setLoading: (value: Boolean) => void;
}

const StyledFormContainer = styled.form`
  & > :not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.assetModalBorderColor};
    margin: 0 0 20px;
    padding: 0 0 20px;
  }
`;

const StyledImageInfoContainer = styled.div`
  display: flex;
`;

const StyledThumbnailContainer = styled.div`
  border-radius: ${({ theme }) => theme.appBorderRadius};
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
  background-color: ${({ theme }) => theme.mediaItemBackgroundColor};
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
    fill: ${({ theme }) => theme.mediaItemIconColor};
    height: 24px;
    width: 24px;
  }
`;

const StyledInfoContainer = styled.div`
  color: ${({ theme }) => theme.assetModalInfoTextColor};
  font-family: ${({ theme }) => theme.appFontFamily};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
˝
  & strong {
    color: ${({ theme }) => theme.assetModalInfoTitleColor};
    display: block;
    font-weight: 500;
    margin: 0 0 1em;
  }
`;

const StyledInputsContainer = styled.div`
  padding-right: 8px !important;
  max-height: 300px;
  overflow: hidden scroll;

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

export const AssetModal = ({ asset, loading, handleError, onClose, onSaveComplete, setLoading }: Props) => {
  const { _createdAt, _id, _type, alt, extension, metadata, originalFilename, title, size, tags, url, location, attribution } = asset;
  const { height, width } = metadata?.dimensions || {};
  const [localTitle, setLocalTitle] = useState<string>(title || originalFilename);
  const [localAlt, setLocalAlt] = useState<string>(alt || '');
  const [localAttribution, setLocalAttribution] = useState<string>(attribution || '');
  const [localLocation, setLocalLocation] = useState<Geopoint>(location || {});
  const [localTags, setLocalTags] = useState<string>((tags || []).join(',') || '');

  const isChanged = localTitle !== (title || '') || localAlt !== (alt || '') || localLocation !== (location || {}) || localAttribution !== (attribution || '') || localTags !== (tags?.join(',') || '');

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

      const title = localTitle
      const alt = localAlt;
      const location = localLocation;
      const attribution = localAttribution;
      const tags = localTags.split(',').map((v) => v.trim());

      await client.patch(_id).set({ title, alt, location, attribution, tags }).commit();
      onSaveComplete();
    } catch (e) {
      handleError(e);
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
            <strong>{localTitle || originalFilename}</strong>
            <br />{formatDate(_createdAt)}
            <br />
            {width && height && (
              <Fragment>
                {width} x {height}
                <br />
              </Fragment>
            )}
            {extension.toUpperCase()}, {formatSize(size)}
          </StyledInfoContainer>
        </StyledImageInfoContainer>

        <StyledInputsContainer>
          {assetFields.title && (
            <LabelWithInput
            label="Title"
            onChange={setLocalTitle}
            placeholder={!localTitle ? 'No title yet...' : undefined}
            value={localTitle}
            />
          )}
          {_type === 'sanity.imageAsset' && assetFields.alt && (
            <LabelWithInput
              label="Alt text"
              onChange={setLocalAlt}
              placeholder={!localAlt ? 'No alt text yet...' : undefined}
              value={localAlt}
            />
          )}
          {assetFields.attribution && (
            <LabelWithInput
              label="Attribution"
              onChange={setLocalAttribution}
              placeholder={!localTitle ? 'No attribution yet...' : undefined}
              value={localAttribution}
            />
          )}
          {assetFields.location && (
            <LabelWithLocationInput
              label="Location"
              onChange={setLocalLocation}
              value={localLocation}
            />
          )}
          {assetFields.location && (
            <LabelWithInput
              label="Tags"
              onChange={setLocalTags}
              placeholder={!localTags ? 'No tags yet...' : undefined}
              value={localTags}
            />
          )}
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
