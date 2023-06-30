import React from 'react';
import Search from '../../searchScreens/search/Search';

const CreateSearch = ({navigation}: {navigation: any}) => {
  return <Search navigation={navigation} mode={'create'} />;
};

export default CreateSearch;
