import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import Text from '../components/Text';
import CategoryList from '../components/CategoryList';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';

const AddByCategory = ({onClose, onSelect}: {onClose: any; onSelect: any}) => {
  return (
    <View style={styles.container}>
      <View style={headerStyles.container}>
        <Text size="m" weight="b">
          {strings.library.addByCategory}
        </Text>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>
      <CategoryList
        onClose={onClose}
        onSelect={category => {
          onSelect({
            id: -category.id,
            name: category.name,
            icon: category.icon,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    marginBottom: s(20),
  },
  title: {
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: s(20),
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    backgroundColor: colors.grey,
  },
  x: {
    width: '50%',
    height: '50%',
    tintColor: colors.black,
  },
});

export default AddByCategory;
