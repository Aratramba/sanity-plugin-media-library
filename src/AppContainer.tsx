import { App } from './App';
import { Asset } from './types/Asset';
import { Modal } from './components/Modal';
import { studioTheme, ThemeProvider, Portal, Layer,ToastProvider } from '@sanity/ui';
import React from 'react';

type Props = {
  onClose?: () => void;
  onSelect?: (assets: Array<any>) => void;
  selectedAssets: Asset[];
  tool?: string;
};

export const AppContainer = ({ onClose, onSelect, selectedAssets, tool }: Props) => (
  <ThemeProvider theme={studioTheme}>
    <ToastProvider>
    {tool ? (
      <App tool={tool} mode="tool" />
    ) : (
      <Portal>
        <Layer zOffset={999}>
          <Modal onClose={onClose ? onClose : () => {}} width={3}>
            <div style={{ height: 1024 }}>
              <App mode="modal" onClose={onClose} onSelect={onSelect} selectedAssets={selectedAssets} tool={tool} />
            </div>
          </Modal>
        </Layer>
      </Portal>
    )}
    </ToastProvider>
  </ThemeProvider>
);
