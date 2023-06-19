import React from 'react';
import Search from '../searchScreens/Search';

const AddSearch = ({navigation}: {navigation: any}) => {
  return <Search navigation={navigation} mode={'add'} />;
};

export default AddSearch;
