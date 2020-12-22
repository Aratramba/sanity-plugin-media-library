import { App } from './App';
import { Asset } from './types/Asset';
import { darkTheme } from './themes/darkTheme';
import { Modal } from './components/Modal';
import { ThemeProvider } from 'styled-components';
import config from 'part:sanity-plugin-media-library/config';
import React from 'react';

type Props = {
  onClose?: () => void;
  onSelect?: (assets: Array<any>) => void;
  selectedAssets: Asset[];
  tool?: string;
};

type ThemeOptions = 'dark';

export const AppContainer = ({ onClose, onSelect, selectedAssets, tool }: Props) => (
  <ThemeProvider theme={getTheme()}>
    {tool ? (
      <App tool={tool} />
    ) : (
      <Modal full onClose={onClose ? onClose : () => {}}>
        <App onClose={onClose} onSelect={onSelect} selectedAssets={selectedAssets} tool={tool} />
      </Modal>
    )}
  </ThemeProvider>
);

function getTheme() {
  const defaultTheme = config.defaultTheme || darkTheme;

  if (typeof config.theme === 'object') {
    return { ...defaultTheme, ...config.theme };
  }

  if (typeof config.theme === 'string') {
    const themes = {
      dark: darkTheme,
    };

    if (config.theme in Object.keys(themes)) {
      const key: ThemeOptions = config.theme;
      return themes[key];
    }

    return darkTheme;
  }

  return darkTheme;
}
