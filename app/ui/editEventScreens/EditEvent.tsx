import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Image,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {Svg, Line, Circle} from 'react-native-svg';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SwipeableItem from 'react-native-swipeable-item';

import PlaceCard from '../components/PlaceCard';
import Category from './Category';
import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';

interface Props {
  navigation: any;
  radius: number;
  latitude: number;
  longitude: number;
  bookmarks: any;
  destinations: any;
  setDestinations: (dest: any) => void;
  selectionIndices: number[];
  setSelectionIndices: (idx: number[]) => void;
  onAddPress: (idx: any) => void;
}

const EditEvent: React.FC<Props> = ({
  navigation,
  radius,
  latitude,
  longitude,
  bookmarks,
  destinations,
  setDestinations,
  selectionIndices,
  setSelectionIndices,
  onAddPress,
}) => {
  const [dragging, setDragging] = useState(false);
  const itemRefs = useRef(new Map());
  const childRefs = useRef(new Map());

  const onMove = (idx: number, direction: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const temp = [...destinations];
    const tempItem = temp[idx];
    temp.splice(idx, 1);
    if (direction !== 0) {
      temp.splice(idx + direction, 0, tempItem);
    } else {
      childRefs.current.forEach(value => {
        value?.closeDropdown();
      });
      childRefs.current.delete(tempItem.id);
    }
    setDestinations(temp);
  };

  const onRemove = (item: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDestinations((prev: any) => {
      return prev.filter((temp: any) => temp !== item);
    });
    itemRefs.current.delete(item.id);
  };

  return (
    <DraggableFlatList
      data={destinations}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flatlist}
      activationDistance={20}
      onDragBegin={() => {
        setDragging(true);
        itemRefs.current.forEach(value => {
          value?.close();
        });
        childRefs.current.forEach(value => {
          value?.closeDropdown();
        });
      }}
      onDragEnd={({data}) => {
        setDragging(false);
        setDestinations(data);
      }}
      onScrollBeginDrag={() => {
        itemRefs.current.forEach(value => {
          value?.close();
        });
        childRefs.current.forEach(value => {
          value?.closeDropdown();
        });
      }}
      renderItem={({
        item,
        getIndex,
        drag,
        isActive,
      }: {
        item: any;
        getIndex: any;
        drag: any;
        isActive: any;
      }) => (
        <View
          onTouchStart={() => {
            itemRefs.current.forEach(value => {
              value?.close();
            });
            childRefs.current.forEach((value, key) => {
              if (key !== item.id) {
                value?.closeDropdown();
              }
            });
          }}>
          {item?.id < 0 ? (
            <View
              key={item.id}
              style={dragging && !isActive && styles.transparent}>
              <Category
                ref={ref => childRefs.current.set(item.id, ref)}
                navigation={navigation}
                radius={radius}
                latitude={latitude}
                longitude={longitude}
                bookmarks={bookmarks}
                category={item}
                categoryIndex={getIndex()}
                selectionIndex={selectionIndices[getIndex()]}
                setSelectionIndex={(idx: number) => {
                  const _selectionIndices = [...selectionIndices];
                  _selectionIndices[getIndex()] = idx;
                  setSelectionIndices(_selectionIndices);
                }}
                destinations={destinations}
                setDestinations={setDestinations}
                onCategoryMove={onMove}
              />
            </View>
          ) : (
            <View
              key={item.id}
              style={[
                styles.cardContainer,
                dragging && !isActive && styles.transparent,
              ]}>
              <SwipeableItem
                ref={ref => itemRefs.current.set(item.id, ref)}
                overSwipe={s(20)}
                item={item}
                renderUnderlayLeft={() => (
                  <View style={styles.removeContainer}>
                    <TouchableOpacity
                      disabled={destinations.length === 1}
                      onPress={() => {
                        onRemove(item);
                      }}
                      style={[
                        styles.removeButton,
                        destinations.length === 1 && {
                          backgroundColor: colors.darkgrey,
                        },
                      ]}>
                      <Image style={styles.remove} source={icons.remove} />
                    </TouchableOpacity>
                  </View>
                )}
                snapPointsLeft={[s(60)]}>
                <TouchableOpacity
                  style={styles.card}
                  onLongPress={drag}
                  delayLongPress={400}
                  disabled={dragging && !isActive}
                  onPress={() => {
                    navigation.navigate('Place', {
                      destination: item,
                      category: item?.category?.name,
                    });
                  }}>
                  <PlaceCard
                    id={item?.id}
                    name={item?.name}
                    info={item?.category?.name}
                    marked={bookmarks?.includes(item?.id)}
                    image={
                      item?.image_url
                        ? {
                            uri: item?.image_url,
                          }
                        : icons.defaultIcon
                    }
                  />
                </TouchableOpacity>
              </SwipeableItem>
            </View>
          )}
          {dragging ? (
            <Separator />
          ) : (
            <TouchableOpacity onPress={() => onAddPress(getIndex())}>
              <AddEventSeparator />
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

const Separator = () => <View style={styles.separator} />;

const AddEventSeparator = () => (
  <Svg width={s(350)} height={s(40)}>
    <Line
      x1={s(20)}
      y1={s(20)}
      x2={s(162.5)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(1)}
    />
    <Circle
      cx={s(175)}
      cy={s(20)}
      r={s(12.5)}
      stroke={colors.accent}
      strokeWidth={s(1)}
      fill="none"
    />
    <Line
      x1={s(175)}
      y1={s(14)}
      x2={s(175)}
      y2={s(26)}
      stroke={colors.accent}
      strokeWidth={s(2)}
      strokeLinecap="round"
    />
    <Line
      x1={s(169)}
      y1={s(20)}
      x2={s(181)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(2)}
      strokeLinecap="round"
    />
    <Line
      x1={s(187.5)}
      y1={s(20)}
      x2={s(330)}
      y2={s(20)}
      stroke={colors.accent}
      strokeWidth={s(1)}
    />
  </Svg>
);

const styles = StyleSheet.create({
  flatlist: {
    paddingTop: s(10),
    paddingBottom: s(20),
  },
  cardContainer: {
    marginHorizontal: s(30),
  },
  card: {
    alignSelf: 'center',
    width: s(290),
  },
  transparent: {
    opacity: 0.6,
  },
  separator: {
    width: s(350),
    height: s(39.4),
  },
  removeContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    paddingRight: s(10),
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    borderWidth: s(2),
    borderColor: colors.white,
    backgroundColor: colors.red,
  },
  remove: {
    width: '70%',
    height: '70%',
    tintColor: colors.white,
  },
});

export default EditEvent;
