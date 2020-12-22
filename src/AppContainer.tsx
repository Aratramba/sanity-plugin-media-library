import { App } from './App';
import { Asset } from './types/Asset';
import { darkTheme } from './themes/darkTheme';
import { lightTheme } from './themes/lightTheme';
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

type ThemeOptions = 'dark' | 'light';

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
  const themes = {
    dark: darkTheme,
    light: lightTheme,
  };

  if (config.defaultTheme && typeof config.defaultTheme !== 'string') {
    throw Error(`Default Theme should be one of ${Object.keys(themes).join(', ')}`);
  }

  if (typeof config.theme === 'object') {
    const defaultTheme = themes[config.defaultTheme as ThemeOptions] || darkTheme;
    return { ...defaultTheme, ...config.theme };
  }

  if (typeof config.theme === 'string') {
    return themes[config.theme as ThemeOptions] || darkTheme;
  }

  return darkTheme;
}
