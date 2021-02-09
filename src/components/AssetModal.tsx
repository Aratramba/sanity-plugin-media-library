import { Asset } from '../types/Asset';
import { Button } from './Button';
import { customFields } from '../config';
import { formatDate, formatSize } from '../shared/utils';
import { Icon } from './Icon';
import { LabelWithInput } from './LabelWithInput';
import { Loader } from './Loader';
import { Modal } from './Modal';
import client from 'part:@sanity/base/client';
import React, { Fragment, FormEvent, useState, useEffect } from 'react';
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

  & strong {
    color: ${({ theme }) => theme.assetModalInfoTitleColor};
    display: block;
    font-weight: 500;
    margin: 0 0 0.5em;
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

const StyledUsageLabel = styled.span`
  background-color: ${({ theme }) => theme.usedLabelBackgroundColor};
  border-radius: ${({ theme }) => theme.appBorderRadius};
  color: ${({ theme }) => theme.usedLabelTextColor};
  display: inline-block;
  font-weight: 500;
  line-height: 1;
`;

const StyledUsageLabelUnused = styled(StyledUsageLabel)`
  background-color: ${({ theme }) => theme.unusedLabelBackgroundColor};
  color: ${({ theme }) => theme.unusedLabelTextColor};
  padding: 3px 5px;
`;

export const AssetModal = ({ asset, loading, handleError, onClose, onSaveComplete, setLoading }: Props) => {
  const { _createdAt, _id, _type, alt, extension, metadata, originalFilename, size, tags, title, url, usedBy } = asset;
  const { height, width } = metadata?.dimensions || {};
  const [localValues, setLocalValues] = useState<{ [key: string]: any }>({
    alt,
    tags: tags?.join(','),
    title,
  });

  useEffect(() => {
    customFields.map((field: any) => setLocalValues((values) => ({ ...values, [field.name]: asset[field.name] })));
  }, []);

  const inputFields = [
    { name: 'title', label: 'Title', placeholder: 'No title yet' },
    { name: 'alt', label: 'Alt text', placeholder: 'No alt text yet' },
    { name: 'tags', label: 'Tags', placeholder: 'No tags yet' },
    ...customFields,
  ];

  const isChanged = Object.entries(localValues).some(([key, newValue]) => {
    const currentValue = asset[key];

    if (newValue === '' && typeof currentValue === 'undefined') {
      return false;
    }

    return newValue !== currentValue;
  });

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();

      if (loading) {
        return;
      }

      setLoading(true);

      if (!isChanged) {
        return onClose();
      }

      const tags = localValues.tags?.split(',').map((v: string) => v.trim());
      await client
        .patch(_id)
        .set({ ...localValues, tags })
        .commit();
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
            <strong>{localValues.title || originalFilename}</strong>
            {usedBy.length === 0 ? (
              <StyledUsageLabelUnused>unused</StyledUsageLabelUnused>
            ) : (
              <StyledUsageLabel>
                Used by {usedBy.length} document{usedBy.length === 1 ? '' : 's'}
              </StyledUsageLabel>
            )}
            <br />
            {formatDate(_createdAt)}
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
          {inputFields.map(({ name, ...rest }) => (
            <LabelWithInput
              key={name}
              onChange={(value: any) => setLocalValues({ ...localValues, [name]: value })}
              value={localValues[name]}
              {...rest}
            />
          ))}
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
