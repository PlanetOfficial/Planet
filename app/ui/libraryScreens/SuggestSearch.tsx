import React from 'react';
import Search from '../searchScreens/search/Search';

const SuggestSearch = ({navigation}: {navigation: any}) => {
  return <Search navigation={navigation} mode={'suggest'} />;
};

export default SuggestSearch;
