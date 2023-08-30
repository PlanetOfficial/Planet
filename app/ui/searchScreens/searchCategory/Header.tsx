import React from 'react';
import {View, SafeAreaView, useColorScheme} from 'react-native';
import MapView from 'react-native-maps';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Coordinate, Category} from '../../../utils/types';
import {getRegionFromPointAndDistance} from '../../../utils/Misc';

interface Props {
  navigation: any;
  category: Category;
  isMyLocationOffset: boolean;
  myLocation: Coordinate;
  setLocation: (location: Coordinate) => void;
  setTempLocation: (location: Coordinate) => void;
  radius: number;
  mapRef: React.RefObject<MapView>;
}

const Header: React.FC<Props> = ({
  navigation,
  category,
  isMyLocationOffset,
  myLocation,
  setLocation,
  setTempLocation,
  radius,
  mapRef,
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
          icon={isMyLocationOffset ? icons.locationFilled : icons.location}
          color={isMyLocationOffset ? colors[theme].accent : colors[theme].secondary}
          disabled={!isMyLocationOffset}
          onPress={() => {
            setLocation(myLocation);
            setTempLocation(myLocation);
            mapRef.current?.animateToRegion(
              getRegionFromPointAndDistance(myLocation, radius),
              500,
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;
