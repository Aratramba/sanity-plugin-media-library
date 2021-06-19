import { Asset } from '../types/Asset';
import { Modal } from './Modal';
import client from 'part:@sanity/base/client';
import React, { useEffect, useState } from 'react';
import { Inline, Text, Spinner, Stack, Button } from '@sanity/ui';
import { WarningOutlineIcon } from '@sanity/icons';

interface Props {
  assets: Array<Asset>;
  loading: Boolean;
  handleError: (error: any) => void;
  onClose: () => void;
  onDeleteComplete: () => void;
  setLoading: (value: Boolean) => void;
}

export const DeleteModal = ({ assets, loading, handleError, onClose, onDeleteComplete, setLoading }: Props) => {
  const plural = assets.length > 1;
  const [usedBy, setUsedBy] = useState(0);
  const title = `Are you sure you want to delete ${plural ? `${assets.length} assets` : 'this asset'}?`;

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

  useEffect(() => {
    setUsedBy(assets.reduce((prev, cur) => (prev += cur.usedBy.length), 0));
  }, [assets]);

  return (
    <Modal onClose={onClose} title={title} width={0}>
      <Stack padding={4} space={4}>
        <Text>
          Used by {usedBy} document{usedBy === 1 ? '' : 's'}.
        </Text>

        <Inline space={3}>
          <Button
            disabled={!!loading}
            tone="critical"
            icon={loading ? Spinner : WarningOutlineIcon}
            onClick={onDelete}
            text={`Delete now`}
          />

          <Button mode="ghost" onClick={onClose} text="Cancel" />
        </Inline>
      </Stack>
    </Modal>
  );
};
