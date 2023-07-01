const colors = {
  accent: '#f36f3f',
  red: '#ff0000',
  green: '#2ac42c',
  dim: 'rgba(0,0,0,.3)',
  primaryShades: ['#f9a67a', '#f6ae2d', '#ff6c32', '#fc2f00'],
  profileShades: ['#8a66cc', '#cc6666', '#94cc66', '#66ccbb', '#6692cc'],
};

const light = {
  ...colors,
  primary: '#ffffff',
  secondary: '#d9d9d9',
  neutral: '#3c3c3c',
};

const dark = {
  ...colors,
  primary: '#2c2c2c',
  secondary: '#666666',
  neutral: '#f0f0f0',
};

export default {light, dark};
