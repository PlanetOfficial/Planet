import React from 'react';
import Search from '../searchScreens/Search';

const CreateSearch = ({navigation}: {navigation: any}) => {
  return <Search navigation={navigation} isCreate={true} />;
};

export default CreateSearch;