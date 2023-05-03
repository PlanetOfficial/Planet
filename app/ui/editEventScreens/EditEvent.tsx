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

import {Place, Category as CategoryT} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
  radius: number;
  latitude: number;
  longitude: number;
  bookmarks: number[];
  destinations: (Place | CategoryT)[];
  setDestinations: (destinations: (Place | CategoryT)[]) => void;
  selectionIndices: number[];
  setSelectionIndices: (idx: number[]) => void;
  onAddPress: (idx: number) => void;
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
  const [dragging, setDragging] = useState<boolean>(false);
  const itemRefs = useRef(new Map());
  const childRefs = useRef(new Map());

  const onMove = (idx: number, direction: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const _destinations: (Place | CategoryT)[] = [...destinations];
    const destination: Place | CategoryT = _destinations[idx];
    const _selectionIndices: number[] = [...selectionIndices];
    const selectionIndex: number = _selectionIndices[idx];
    _destinations.splice(idx, 1);
    _selectionIndices.splice(idx, 1);
    if (direction !== 0) {
      _destinations.splice(idx + direction, 0, destination);
      _selectionIndices.splice(idx + direction, 0, selectionIndex);
    } else {
      childRefs.current.forEach(value => {
        value?.closeDropdown();
      });
      childRefs.current.delete(destination.id);
    }
    setDestinations(_destinations);
    setSelectionIndices(_selectionIndices);
  };

  const onRemove = (destination: Place | CategoryT) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let _destinations: (Place | CategoryT)[] = [...destinations];
    setDestinations(
      _destinations.filter(
        (_destination: Place | CategoryT) => _destination.id !== destination.id,
      ),
    );
    itemRefs.current.delete(destination.id);
  };

  const isPlace = (destination: Place | CategoryT): destination is Place => {
    return destination.hasOwnProperty('latitude');
  };

  return (
    <DraggableFlatList
      data={destinations}
      keyExtractor={(_: Place | CategoryT, index: number) => index.toString()}
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
      onDragEnd={({
        data,
        from,
        to,
      }: {
        data: (Place | CategoryT)[];
        from: number;
        to: number;
      }) => {
        setDragging(false);
        setDestinations(data);
        const _selectionIndices: number[] = [...selectionIndices];
        const item = _selectionIndices.splice(from, 1)[0];
        _selectionIndices.splice(to, 0, item);
        setSelectionIndices(_selectionIndices);
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
        item: Place | CategoryT;
        getIndex: () => number | undefined;
        drag: () => void;
        isActive: boolean;
      }) => {
        let _index: any = getIndex(); // typescript is so stupid
        const index: number = _index;
        return (
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
            {isPlace(item) ? (
              <View
                key={item.id}
                style={[
                  styles.cardContainer,
                  dragging && !isActive ? styles.transparent : null,
                ]}>
                <SwipeableItem
                  ref={ref => itemRefs.current.set(item.id, ref)}
                  overSwipe={s(20)}
                  item={item}
                  renderUnderlayLeft={() => (
                    <View style={styles.removeContainer}>
                      <TouchableOpacity
                        disabled={destinations.length === 1}
                        onPress={() => onRemove(item)}
                        style={[
                          styles.removeButton,
                          destinations.length === 1
                            ? {
                                backgroundColor: colors.darkgrey,
                              }
                            : null,
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
                        category: item?.category_name,
                      });
                    }}>
                    <PlaceCard
                      id={item?.id}
                      name={item?.name}
                      info={item?.category_name}
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
            ) : (
              <View
                key={item.id}
                style={dragging && !isActive ? styles.transparent : null}>
                <Category
                  ref={ref => childRefs.current.set(item.id, ref)}
                  navigation={navigation}
                  radius={radius}
                  latitude={latitude}
                  longitude={longitude}
                  bookmarks={bookmarks}
                  category={item}
                  categoryIndex={index}
                  destination={destinations[index]}
                  selectionIndex={selectionIndices[index]}
                  setSelectionIndex={(idx: number) => {
                    const _selectionIndices = [...selectionIndices];
                    _selectionIndices[index] = idx;
                    setSelectionIndices(_selectionIndices);
                  }}
                  destinations={destinations}
                  setDestinations={setDestinations}
                  onCategoryMove={onMove}
                />
              </View>
            )}
            {dragging ? (
              <Separator />
            ) : (
              <TouchableOpacity onPress={() => onAddPress(index)}>
                <AddEventSeparator />
              </TouchableOpacity>
            )}
          </View>
        );
      }}
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
