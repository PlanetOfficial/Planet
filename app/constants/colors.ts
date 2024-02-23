import {StatusBarStyle} from 'react-native';

const colors = {
  transparent: 'transparent',
  black: '#000000',
  blue: '#3482F6',
  green: '#2ac42c',
  purple: '#8a66cc',
  dim: 'rgba(0,0,0,.3)',
  profileShades: ['#8a66cc', '#cc6666', '#94cc66', '#66ccbb', '#6692cc'],
};

const light = {
  ...colors,
  background: '#ffffff',
  transparent: 'rgba(255, 255, 255, 0)',
  primary: '#ffffff',
  secondary: '#c9c9c9',
  neutral: '#3c3c3c',
  accent: '#f36f3f',
  red: '#ff0000',
  blur: 'rgba(255,255,255,.8)',
  primaryShades: ['#5B5F97', '#3DA5D9', '#FFC145', '#FF6B6C'],
  statusBar: 'dark-content' as StatusBarStyle,
  androidNavigationBarStyle: 'dark' as 'dark' | 'light',
};

const dark = {
  ...colors,
  background: '#1c1c1c',
  transparent: 'rgba(28, 28, 28, 0)',
  primary: '#2d2d2d',
  secondary: '#666666',
  neutral: '#f0f0f0',
  accent: '#f38158',
  red: '#ff5533',
  blur: 'rgba(0,0,0,.6)',
  primaryShades: ['#5B5F97', '#3DA5D9', '#FFC145', '#FF6B6C'],
  statusBar: 'light-content' as StatusBarStyle,
  androidNavigationBarStyle: 'light' as 'dark' | 'light',
};

export const lightChatTheme = {
  accent_blue: '#005FFF',
  accent_green: '#20E070',
  accent_red: '#FF3742',
  bg_gradient_end: light.background,
  bg_gradient_start: light.background,
  black: light.neutral,
  blue_alice: '#E9F2FF',
  border: '#00000014', // 14 = 8% opacity; top: x=0, y=-1; bottom: x=0, y=1
  grey: '#7A7A7A',
  grey_dark: '#72767E',
  grey_gainsboro: '#DBDBDB',
  grey_whisper: '#ECEBEB',
  icon_background: light.background,
  label_bg_transparent: '#00000033', // 33 = 20% opacity
  light_gray: '#DBDDE1',
  modal_shadow: '#00000099', // 99 = 60% opacity; x=0, y= 1, radius=4
  overlay: '#000000CC', // CC = 80% opacity
  shadow_icon: '#00000040', // 40 = 25% opacity; x=0, y=0, radius=4
  static_black: light.neutral,
  static_white: light.background,
  targetedMessageBackground: '#FBF4DD', // dark mode = #302D22
  transparent: light.background,
  white: light.background,
  white_smoke: light.background,
  white_snow: light.background,
};

export const darkChatTheme = {
  accent_blue: '#005FFF',
  accent_green: '#20E070',
  accent_red: '#FF3742',
  bg_gradient_end: dark.background,
  bg_gradient_start: dark.background,
  black: dark.neutral,
  blue_alice: '#E9F2FF',
  border: '#00000014', // 14 = 8% opacity; top: x=0, y=-1; bottom: x=0, y=1
  grey: '#7A7A7A',
  grey_dark: '#72767E',
  grey_gainsboro: '#242424',
  grey_whisper: '#131313',
  icon_background: dark.background,
  label_bg_transparent: '#FFFFFF33', // 33 = 20% opacity
  light_gray: '#DBDDE1',
  modal_shadow: '#00000099', // 99 = 60% opacity; x=0, y= 1, radius=4
  overlay: '#FFFFFFCC', // CC = 80% opacity
  shadow_icon: '#00000040', // 40 = 25% opacity; x=0, y=0, radius=4
  static_black: dark.neutral,
  static_white: dark.background,
  targetedMessageBackground: '#302D22', // dark mode = #302D22
  transparent: dark.background,
  white: dark.background,
  white_smoke: dark.background,
  white_snow: dark.background,
};

export default {light, dark};
