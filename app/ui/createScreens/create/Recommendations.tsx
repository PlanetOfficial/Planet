import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Alert,
  useColorScheme,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {s} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';
import PoiCardXL from '../../components/PoiCardXL';

import {Coordinate, Poi, Recommendation} from '../../../utils/types';
import {fetchUserLocation} from '../../../utils/Misc';
import {getRecommendations} from '../../../utils/api/recommenderAPI';

interface Props {
  navigation: any;
  setRecommendationsShown: (recommendationsShown: boolean) => void;
  setDestinations: (destinations: Poi[]) => void;
  setDestinationNames: (destinationNames: Map<number, string>) => void;
}

const Recommendations: React.FC<Props> = ({
  navigation,
  setRecommendationsShown,
  setDestinations,
  setDestinationNames,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const loadRecommendations = useCallback(async (loc: Coordinate) => {
    const _recommendations = await getRecommendations(
      loc?.latitude,
      loc?.longitude,
      false,
    );
    if (_recommendations) {
      setRecommendations(_recommendations);
    } else {
      Alert.alert(strings.error.error, strings.error.loadRecommendations);
    }
  }, []);

  useEffect(() => {
    const initializeRecommendations = async () => {
      loadRecommendations(await fetchUserLocation());
    };

    initializeRecommendations();
  }, [loadRecommendations]);

  const insets = useSafeAreaInsets();

  return (
    <>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        snapToInterval={s(320.5)}
        snapToAlignment={'start'}
        decelerationRate={'fast'}>
        {recommendations.map((recommendation, idx) => (
          <ScrollView
            key={idx}
            contentContainerStyle={{
              paddingBottom: insets.bottom + s(75),
            }}
            showsVerticalScrollIndicator={false}
            onTouchStart={() => Keyboard.dismiss()}>
            <View style={[styles.scrollViewVertical, STYLES.shadow]}>
              <TouchableOpacity
                style={styles.accept}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setRecommendationsShown(false);
                  setDestinations(recommendation.places);
                  setDestinationNames(
                    new Map(
                      recommendation.places.map((place: Poi, i: number) => [
                        place.id,
                        recommendation.categories[i],
                      ]),
                    ),
                  );
                }}>
                <View style={STYLES.icon}>
                  <Icon icon={icons.check} color={colors[theme].primary} />
                </View>
                <Text size="s" color={colors[theme].primary}>
                  {strings.event.accept}
                </Text>
              </TouchableOpacity>
              {recommendation.places.map((destination: Poi, i: number) => (
                <View key={i}>
                  <View style={styles.container}>
                    <View style={styles.cardHeader}>
                      <Text size="s">{recommendation.categories[i]}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.card}
                      onPress={() =>
                        navigation.navigate('Poi', {
                          poi: destination,
                          mode: 'inCreate',
                        })
                      }>
                      <PoiCardXL place={destination} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ))}
      </ScrollView>
      <View style={styles.absolute}>
        <LinearGradient
          colors={[colors[theme].transparent, colors[theme].background]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          locations={[0, 0.1]}>
          <SafeAreaView>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.hide}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setRecommendationsShown(false);
                }}>
                <View style={STYLES.icon}>
                  <Icon icon={icons.hide} />
                </View>
                <Text size="s">{strings.event.hide}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    scrollView: {
      paddingLeft: s(15),
      paddingRight: s(15),
    },
    scrollViewVertical: {
      margin: s(3),
      borderRadius: s(5),
      backgroundColor: colors[theme].primary,
    },
    container: {
      width: s(300),
      marginHorizontal: s(7),
      paddingTop: s(5),
      borderTopWidth: 1,
      borderColor: colors[theme].secondary,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: s(10),
      paddingHorizontal: s(10),
    },
    card: {
      marginBottom: s(10),
    },
    footer: {
      height: s(75),
      width: s(350),
    },
    absolute: {
      position: 'absolute',
      bottom: 0,
    },
    accept: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: s(20),
      paddingVertical: s(10),
      marginVertical: s(10),
      width: s(300),
      borderRadius: s(5),
      backgroundColor: colors[theme].accent,
    },
    hide: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: s(20),
      paddingVertical: s(10),
      marginTop: s(15),
      width: s(314),
      borderRadius: s(5),
      backgroundColor: colors[theme].secondary,
    },
  });

export default Recommendations;
