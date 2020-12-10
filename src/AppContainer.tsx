import { App } from './App';
import { Asset } from './types/Asset';
import { Modal } from './components/Modal';
import React from 'react';

type Props = {
  onClose?: () => void;
  onSelect?: (assets: Array<any>) => void;
  selectedAssets: Asset[];
  tool?: string;
};

export const AppContainer = ({ onClose, onSelect, selectedAssets, tool }: Props) =>
  tool ? (
    <App onClose={onClose} onSelect={onSelect} selectedAssets={selectedAssets} tool={tool} />
  ) : (
    <Modal full onClose={onClose ? onClose : () => {}}>
      <App onClose={onClose} onSelect={onSelect} selectedAssets={selectedAssets} tool={tool} />
    </Modal>
  );
