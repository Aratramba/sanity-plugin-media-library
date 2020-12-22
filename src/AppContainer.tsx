import { App } from './App';
import { Asset } from './types/Asset';
import { darkTheme } from './themes/darkTheme';
import { lightTheme } from './themes/lightTheme';
import { Modal } from './components/Modal';
import { theme, themeChanges } from './config';
import { ThemeProvider } from 'styled-components';
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

  const themeToUse = themes[theme as ThemeOptions];

  if (themeChanges && Object.keys(themeChanges).length) {
    return { ...themeToUse, ...themeChanges };
  } else {
    return themeToUse;
  }
}
