import { addons } from '@storybook/manager-api';
import oceanTheme from './oceanTheme';

addons.setConfig({
  theme: oceanTheme,
  isFullscreen: true,
  showNav: false,
  showPanel: false,
  showToolbar: false
});