import { Asset, Geopoint, Attributes } from '../types/Asset';
import { Button } from './Button';
import { formatDate, formatSize } from '../shared/utils';
import { Icon } from './Icon';
import { LabelWithInput, LabelWithLocationInput, LabelWithCheckbox, LabelWithNumericalInput } from './LabelWithInput';
import { Loader } from './Loader';
import { Modal } from './Modal';
import { assetFields, customAssetFields } from '../config';
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

type CustomAssetField = {
  name: string
  label: string
  placeholder?: string
  type: 'text' | 'checkbox' | 'number' | 'textarea';
  min?: number
  max?: number
  step?: number | 'any'
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
  const { _createdAt, _id, _type, alt, extension, metadata, originalFilename, title, size, tags, url, location, attribution, attributes } = asset;
  const { height, width } = metadata?.dimensions || {};
  const [localTitle, setLocalTitle] = useState<string>(title || originalFilename);
  const [localAlt, setLocalAlt] = useState<string>(alt || '');
  const [localAttribution, setLocalAttribution] = useState<string>(attribution || '');
  const [localLocation, setLocalLocation] = useState<Geopoint>(location || {});
  const [localTags, setLocalTags] = useState<string>((tags || []).join(',') || '');
  const [localAttributes, setLocalAttributes] = useState<Attributes>(attributes || {});

  const isChanged = localTitle !== (title || '') || localAlt !== (alt || '') || localLocation !== (location || {}) || localAttribution !== (attribution || '') || localTags !== (tags?.join(',') || '') || localAttributes !== (attributes || {});

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
      const attributes = localAttributes;
      const tags = localTags.split(',').map((v) => v.trim());

      await client.patch(_id).set({ title, alt, location, attribution, tags, attributes }).commit();
      onSaveComplete();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }

  function renderAttributes(attribute: CustomAssetField) {
    const handleChange = (value: any) => setLocalAttributes(prevState => ({
      ...prevState,
      [attribute.name]: attribute.type === 'number' && value ? parseFloat(value) : value
    }))
    switch(attribute.type) {
      case 'checkbox':
        return <LabelWithCheckbox key={attribute.name} label={attribute.label} onChange={handleChange} value={localAttributes[attribute.name] as string & boolean | undefined} />;
      case 'number':
        return <LabelWithNumericalInput key={attribute.name} label={attribute.label} onChange={handleChange} value={localAttributes[attribute.name] as number | undefined } min={attribute.min} max={attribute.max} step={attribute.step}/>;
      default:
        return <LabelWithInput key={attribute.name} label={attribute.label} onChange={handleChange} placeholder={attribute.placeholder} value={localAttributes[attribute.name] as string | readonly string[]} type={attribute.type} />;
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
              type="textarea"
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
          {assetFields.tags && (
            <LabelWithInput
              label="Tags"
              onChange={setLocalTags}
              placeholder={!localTags ? 'No tags yet...' : undefined}
              value={localTags}
            />
          )}
          {customAssetFields.map((field: CustomAssetField) => renderAttributes(field))}
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
