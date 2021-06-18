import { App } from './App';
import { Asset } from './types/Asset';
import { Modal } from './components/Modal';
import { studioTheme, ThemeProvider } from '@sanity/ui';
import React from 'react';

type Props = {
  onClose?: () => void;
  onSelect?: (assets: Array<any>) => void;
  selectedAssets: Asset[];
  tool?: string;
};

export const AppContainer = ({ onClose, onSelect, selectedAssets, tool }: Props) => (
  <ThemeProvider theme={studioTheme}>
    {tool ? (
      <App tool={tool} />
    ) : (
      <Modal full onClose={onClose ? onClose : () => {}}>
        <App onClose={onClose} onSelect={onSelect} selectedAssets={selectedAssets} tool={tool} />
      </Modal>
    )}
  </ThemeProvider>
);
