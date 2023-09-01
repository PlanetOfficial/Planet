import React from 'react';
import {View, SafeAreaView, useColorScheme} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Coordinate, Category} from '../../../utils/types';

interface Props {
  navigation: any;
  category: Category;
  isMyLocationOffset: boolean;
  myLocation: Coordinate;
}

const Header: React.FC<Props> = ({
  navigation,
  category,
  isMyLocationOffset,
  myLocation,
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
          color={
            isMyLocationOffset ? colors[theme].accent : colors[theme].secondary
          }
          disabled={!isMyLocationOffset}
          onPress={() => {
            navigation.navigate('SearchMap', {
              myLocation,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;
