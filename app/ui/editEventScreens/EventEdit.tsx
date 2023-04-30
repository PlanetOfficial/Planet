import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {Svg, Line, Circle} from 'react-native-svg';
import DraggableFlatList from 'react-native-draggable-flatlist';

import PlaceCard from '../components/PlaceCard';
import Category from './Category';
import {icons} from '../../constants/images';
import {colors} from '../../constants/theme';

interface Props {
  navigation: any;
  bookmarks: any;
  tempPlaces: any;
  setTempPlaces: (arg0: any) => void;
  onAddPress: (arg0: any) => void;
}

const EditEvent: React.FC<Props> = ({
  navigation,
  bookmarks,
  tempPlaces,
  setTempPlaces,
  onAddPress,
}) => {
  const [dragging, setDragging] = useState(false);
  const childRefs = useRef(new Map());

  const onMove = (idx: number, direction: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const temp = [...tempPlaces];
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
    setTempPlaces(temp);
    console.log(temp);
  };

  return (
    <DraggableFlatList
      data={tempPlaces}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flatlist}
      onDragBegin={() => {
        setDragging(true);
        childRefs.current.forEach(value => {
          value?.closeDropdown();
        });
      }}
      onDragEnd={({data}) => {
        setDragging(false);
        setTempPlaces(data);
      }}
      onScrollBeginDrag={() => {
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
            childRefs.current.forEach((value, key) => {
              if (key !== item.id) {
                value?.closeDropdown();
              }
            });
          }}>
          {item?.id < 0 ? (
            <View style={dragging && !isActive && styles.transparent}>
              <Category
                ref={ref => childRefs.current.set(item.id, ref)}
                navigation={navigation}
                bookmarks={bookmarks}
                category={item}
                categoryIndex={getIndex()}
                tempPlaces={tempPlaces}
                onCategoryMove={onMove}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.card, dragging && !isActive && styles.transparent]}
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
});

export default EditEvent;
