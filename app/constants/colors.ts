import {StatusBarStyle} from 'react-native';

const colors = {
  blue: '#3482F6',
  green: '#2ac42c',
  dim: 'rgba(0,0,0,.3)',
  profileShades: ['#8a66cc', '#cc6666', '#94cc66', '#66ccbb', '#6692cc'],
};

const light = {
  ...colors,
  background: '#ffffff',
  primary: '#ffffff',
  secondary: '#c9c9c9',
  neutral: '#3c3c3c',
  accent: '#f36f3f',
  red: '#ff0000',
  blur: 'rgba(255,255,255,.8)',
  primaryShades: ['#f9a67a', '#f6ae2d', '#ff6c32', '#fc2f00'],
  statusBar: 'dark-content' as StatusBarStyle,
  androidNavigationBarStyle: 'dark' as 'dark' | 'light',
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
  primaryShades: ['#FAB794', '#F7BE56', '#FF895A', '#E75432'],
  statusBar: 'light-content' as StatusBarStyle,
  androidNavigationBarStyle: 'light' as 'dark' | 'light',
};

export default {light, dark};
