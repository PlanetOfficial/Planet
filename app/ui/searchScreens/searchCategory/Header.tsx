import React from 'react';
import {View, SafeAreaView, useColorScheme} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Coordinate, Category, CreateModes} from '../../../utils/types';

interface Props {
  navigation: any;
  category: Category;
  myLocationOff: boolean;
  myLocation: Coordinate;
  mode: CreateModes;
}

const Header: React.FC<Props> = ({
  navigation,
  category,
  myLocationOff,
  myLocation,
  mode,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        <Icon size="m" icon={icons.back} onPress={() => navigation.goBack()} />
        <Text>{category.name}</Text>
        <Icon
          size="m"
          icon={icons.locationFilled}
          color={myLocationOff ? colors[theme].accent : colors[theme].blue}
          onPress={() => {
            navigation.navigate('SearchMap', {
              mode: mode,
              myLocation: myLocation,
              category: category,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;