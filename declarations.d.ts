declare module '*.svg' {
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '@env' {
  export const XANO_API_KEY: string;
  export const USER_API_URL: string;
  export const POI_API_URL: string;
  export const EVENT_API_URL: string;
  export const FRIEND_API_URL: string;
  export const RECOMMENDER_API_URL: string;
  export const GOOGLE_MAPS_API_KEY: string;
}
