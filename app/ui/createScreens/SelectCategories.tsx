import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';

import Text from '../components/Text';
import Icon from '../components/Icon';
import CategoryList from '../components/CategoryList';

const SelectCategories = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [latitude] = useState(route?.params?.latitude);
  const [longitude] = useState(route?.params?.longitude);
  const [radius] = useState(route?.params?.radius); // in meters

  const [selectedCategories, setSelectedCategories]: [any, any] = useState([]);

  const onCategorySelect = (category: any) => {
    if (!selectedCategories.find((item: any) => item.id === category.id)) {
      setSelectedCategories((prevCategories: any) => [
        ...prevCategories,
        {id: category.id, name: category.name, icon: category.icon},
      ]);
    }
  };

  const removeCategory = (categoryId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCategories(
      selectedCategories.filter((item: any) => item.id !== categoryId),
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="s"
            icon={icons.back}
            onPress={() => navigation.navigate('MapSelection')}
          />
          <Text>{strings.createTabStack.selectCategories}</Text>
          <Icon
            size="s"
            icon={icons.confirm}
            disabled={selectedCategories?.length === 0}
            onPress={() => {
              navigation.navigate('SelectDestinations', {
                selectedCategories: selectedCategories,
                radius: radius,
                latitude: latitude,
                longitude: longitude,
              });
            }}
          />
        </View>
      </SafeAreaView>

      <CategoryList onSelect={onCategorySelect} />

      <SafeAreaView>
        <View style={styles.title}>
          <Text size="s" weight="b">
            {strings.createTabStack.selected + ':'}
          </Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.contentContainer}>
            {selectedCategories.length > 0 ? (
              selectedCategories.map((selected: any) => (
                <View key={selected.id} style={styles.category}>
                  <Image style={styles.icon} source={selected.icon} />
                  <TouchableOpacity
                    style={styles.xButton}
                    onPress={() => removeCategory(selected.id)}>
                    <Image style={styles.x} source={icons.x} />
                  </TouchableOpacity>
                  <View style={styles.name}>
                    <Text size="xs" numberOfLines={2} center={true}>
                      {selected.name}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noCatSelected}>
                <Text color={colors.darkgrey}>
                  {strings.createTabStack.noCategoriesSelected}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: s(40),
    paddingHorizontal: s(20),
    marginBottom: s(20),
  },
  title: {
    marginLeft: s(20),
    marginBottom: s(10),
  },
  scrollView: {
    paddingHorizontal: s(20),
  },
  contentContainer: {
    flexDirection: 'row',
    height: s(85),
    minWidth: s(310),
    borderRadius: s(10),
    backgroundColor: colors.grey,
    paddingVertical: s(5),
  },
  noCatSelected: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(77.5), // (350 - 2 * 20) / 4
  },
  icon: {
    marginTop: s(5),
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    borderWidth: 1,
    tintColor: colors.black,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  name: {
    width: s(60),
    height: s(30),
    justifyContent: 'center',
  },
  xButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: s(15),
    width: s(18),
    height: s(18),
    backgroundColor: colors.white,
    borderRadius: s(10),
  },
  x: {
    width: '45%',
    height: '45%',
    tintColor: colors.black,
  },
});

export default SelectCategories;
