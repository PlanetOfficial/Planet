import React, {useState} from 'react';
import {View, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
} from 'react-native-draggable-flatlist';

import {colors} from '../../constants/colors';
import {icons} from '../../constants/icons';
import strings from '../../constants/strings';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {Subcategory} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
  route: any;
}

const LiveCategorySettings: React.FC<Props> = ({navigation, route}) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(
    route?.params?.subcategories,
  );

  const [hiddenSubCategories, setHiddenSubCategories] = useState<Subcategory[]>(
    route?.params?.hiddenSubCategories,
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.back}>
            <Icon
              icon={icons.back}
              onPress={() =>
                navigation.navigate('LiveCategory', {
                  subcategories,
                  hiddenSubCategories,
                })
              }
            />
          </View>
          <Text>{strings.filter.editView}</Text>
        </View>
      </SafeAreaView>
      <NestableScrollContainer
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomPadding}>
        <View style={categoryStyles.header}>
          <Text size="s" weight="b">
            {strings.filter.visible}:
          </Text>
        </View>
        <NestableDraggableFlatList
          data={subcategories}
          keyExtractor={(item: Subcategory) => item.id.toString()}
          onDragEnd={({data}) => setSubcategories(data)}
          renderItem={({
            item,
            drag,
            isActive,
          }: {
            item: Subcategory;
            drag: () => void;
            isActive: boolean;
          }) => (
            <>
              <View
                style={[
                  categoryStyles.container,
                  isActive ? categoryStyles.shadow : null,
                ]}>
                <Icon
                  size="m"
                  icon={icons.hide}
                  color={colors.darkgrey}
                  onPress={() => {
                    setSubcategories(
                      subcategories.filter(
                        (subcategory: Subcategory) =>
                          subcategory.id !== item.id,
                      ),
                    );
                    setHiddenSubCategories(
                      (_hiddenSubCategories: Subcategory[]) => [
                        ..._hiddenSubCategories,
                        item,
                      ],
                    );
                  }}
                />
                <View style={categoryStyles.title}>
                  <Text size="s">{item.name}</Text>
                </View>
                <TouchableOpacity
                  delayLongPress={1}
                  onLongPress={drag}
                  disabled={isActive}>
                  <Icon size="m" icon={icons.drag} color={colors.darkgrey} />
                </TouchableOpacity>
              </View>
              <View style={categoryStyles.border} />
            </>
          )}
        />
        <View style={categoryStyles.header}>
          <Text size="s" weight="b">
            {strings.filter.hidden}:
          </Text>
        </View>
        <NestableDraggableFlatList
          data={hiddenSubCategories}
          keyExtractor={(item: Subcategory) => item.id.toString()}
          renderItem={({item}: {item: Subcategory}) => (
            <>
              <View style={categoryStyles.container}>
                <Icon
                  size="m"
                  icon={icons.plus}
                  color={colors.accent}
                  onPress={() => {
                    setHiddenSubCategories(
                      hiddenSubCategories.filter(
                        (subcategory: Subcategory) =>
                          subcategory.id !== item.id,
                      ),
                    );
                    setSubcategories((_subcategories: Subcategory[]) => [
                      ..._subcategories,
                      item,
                    ]);
                  }}
                />
                <View style={categoryStyles.title}>
                  <Text size="s">{item.name}</Text>
                </View>
              </View>
              <View style={categoryStyles.border} />
            </>
          )}
        />
      </NestableScrollContainer>
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
    alignItems: 'center',
    justifyContent: 'center',
    width: s(350),
    height: s(50),
    paddingHorizontal: s(20),
  },
  back: {
    position: 'absolute',
    left: s(20),
  },
  bottomPadding: {
    paddingBottom: s(40),
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(12),
    backgroundColor: colors.white,
  },
  header: {
    marginTop: s(10),
    marginLeft: s(20),
  },
  border: {
    marginHorizontal: s(20),
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  title: {
    flex: 1,
    marginHorizontal: s(10),
  },
});

export default LiveCategorySettings;
