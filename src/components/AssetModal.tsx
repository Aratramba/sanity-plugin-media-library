import { Asset } from '../types/Asset';
import { customFields } from '../config';
import { formatDate, formatSize } from '../shared/utils';
import { LabelWithInput } from './LabelWithInput';
import { Modal } from './Modal';
import { DeleteModal } from './DeleteModal';
import client from 'part:@sanity/base/client';
import React, { FormEvent, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Stack, Button, Inline, Badge, Text, Spinner, Flex } from '@sanity/ui';
import { CheckmarkIcon, DocumentIcon, RemoveIcon } from '@sanity/icons';

interface Props {
  asset: Asset;
  loading: Boolean;
  handleError: (error: any) => void;
  onClose: () => void;
  onSaveComplete: () => void;
  setLoading: (value: Boolean) => void;
}

const StyledInputsContainer = styled.div`
  padding-right: 8px !important;
  max-height: 30vh;
  overflow: hidden scroll;
`;

export const AssetModal = ({ asset, loading, handleError, onClose, onSaveComplete, setLoading }: Props) => {
  const { _createdAt, _id, _type, alt, extension, metadata, originalFilename, size, tags, title, url, usedBy } = asset;
  const { height, width } = metadata?.dimensions || {};
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [checkDelete, setCheckDelete] = useState<boolean>(false);

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

  useEffect(() => {
    const hasChanges = Object.entries(localValues).some(([key, newValue]) => {
      const currentValue = asset[key];
      if (newValue === '' && typeof currentValue === 'undefined') {
        return false;
      }
      return newValue !== currentValue;
    });
    setIsChanged(hasChanges);
  }, [localValues]);

  async function handleSubmit(e: FormEvent | null) {
    try {
      e?.preventDefault();

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
    <>
      {checkDelete ? (
        <DeleteModal
          assets={[asset]}
          loading={false}
          onClose={() => setCheckDelete(false)}
          handleError={handleError}
          onDeleteComplete={onSaveComplete}
          setLoading={setLoading}
        />
      ) : (
        <Modal onClose={onClose} title={originalFilename}>
          <form onSubmit={handleSubmit}>
            <Box padding={4}>
              <Inline space={3}>
                {_type === 'sanity.imageAsset' ? (
                  <img alt={alt} src={`${url}?w=100&h=100&fit=crop&auto=format&q=80`} />
                ) : (
                  <Text>
                    <DocumentIcon />
                  </Text>
                )}

                <Stack space={2}>
                  {usedBy && (
                    <>
                      {usedBy.length === 0 ? (
                        <Inline>
                          <Badge mode="outline" tone="caution">
                            Unused
                          </Badge>
                        </Inline>
                      ) : (
                        <Text size={1}>
                          Used by {usedBy.length} document{usedBy.length === 1 ? '' : 's'}
                        </Text>
                      )}
                    </>
                  )}
                  <Text size={1}>{formatDate(_createdAt)}</Text>
                  {width && height && (
                    <Text size={1}>
                      {width} x {height}
                      <br />
                    </Text>
                  )}
                  <Text size={1}>
                    {extension.toUpperCase()}, {formatSize(size)}
                  </Text>
                </Stack>
              </Inline>
            </Box>

            <StyledInputsContainer>
              <Stack space={5} padding={4}>
                {inputFields.map(({ name, ...rest }) => (
                  <LabelWithInput
                    key={name}
                    onChange={(value: any) => setLocalValues({ ...localValues, [name]: value })}
                    value={localValues[name]}
                    {...rest}
                  />
                ))}
              </Stack>
            </StyledInputsContainer>

            <Box padding={4}>
              <Flex>
                <Inline space={3}>
                  <Button
                    disabled={!isChanged || Boolean(loading)}
                    tone="primary"
                    onClick={handleSubmit}
                    text="Save changes"
                    icon={loading ? Spinner : CheckmarkIcon}
                    padding={[3, 3, 4]}
                  />
                  <Button tone="primary" mode="ghost" onClick={() => onClose()} text="Cancel" padding={[3, 3, 4]} />
                </Inline>
                <Button
                  disabled={Boolean(loading)}
                  style={{ marginLeft: 'auto' }}
                  tone="critical"
                  icon={RemoveIcon}
                  onClick={() => setCheckDelete(true)}
                  text={`Delete asset`}
                  padding={[3, 3, 4]}
                />
              </Flex>
            </Box>
          </form>
        </Modal>
      )}
    </>
  );
};
