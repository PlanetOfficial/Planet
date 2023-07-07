import {StatusBarStyle} from 'react-native';

const colors = {
  green: '#2ac42c',
  dim: 'rgba(0,0,0,.6)',
  primaryShades: ['#f9a67a', '#f6ae2d', '#ff6c32', '#fc2f00'],
  profileShades: ['#8a66cc', '#cc6666', '#94cc66', '#66ccbb', '#6692cc'],
};

const light = {
  ...colors,
  background: '#ffffff',
  primary: '#ffffff',
  secondary: '#d9d9d9',
  neutral: '#3c3c3c',
  accent: '#f36f3f',
  red: '#ff0000',
  blur: 'rgba(255,255,255,.8)',
  statusBar: 'dark-content' as StatusBarStyle,
};

const dark = {
  ...colors,
  background: '#1c1c1c',
  primary: '#2d2d2d',
  secondary: '#666666',
  neutral: '#f0f0f0',
  accent: '#f38158',
  red: '#ff5533',
  blur: 'rgba(0,0,0,.6)',
  statusBar: 'light-content' as StatusBarStyle,
};

export default {light, dark};
