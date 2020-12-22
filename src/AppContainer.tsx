import { App } from './App';
import { Asset } from './types/Asset';
import { darkTheme } from './themes/darkTheme';
import { Modal } from './components/Modal';
import { ThemeProvider } from 'styled-components';
import React from 'react';

type Props = {
  onClose?: () => void;
  onSelect?: (assets: Array<any>) => void;
  selectedAssets: Asset[];
  tool?: string;
};

export const AppContainer = ({ onClose, onSelect, selectedAssets, tool }: Props) => (
  <ThemeProvider theme={darkTheme}>
    {tool ? (
      <App tool={tool} />
    ) : (
      <Modal full onClose={onClose ? onClose : () => {}}>
        <App onClose={onClose} onSelect={onSelect} selectedAssets={selectedAssets} tool={tool} />
      </Modal>
    )}
  </ThemeProvider>
);
