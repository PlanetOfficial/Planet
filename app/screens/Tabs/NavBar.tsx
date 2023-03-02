import React from "react";

import { Image, StyleSheet, Dimensions, View, Text } from 'react-native'
// TODO: index.js to clean up imports
import Trending from './Trending';
import Friends from './Friends';
import Library from './Library';
import Settings from './Settings';
import MapSelection from '../createScreens/MapSelection'
import icons from "../../constants/icons";
import {colors} from "../../constants/theme";
import integers from "../../constants/integers";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

function NavBar(){ 
    return(
        <Tab.Navigator screenOptions={({route}) => ({
            tabBarStyle: styles.navBar,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => {
                let source: number;

                switch(route.name){
                    case 'Trending':
                        source = focused? icons.trendingActive: icons.trendingInactive;
                        break;
                    case 'Friends':
                        source = focused? icons.friendsActive: icons.friendsInactive;
                        break;
                    case 'Library':
                        source = focused? icons.libraryActive: icons.libraryInactive;
                        break;
                    case 'Settings':
                        source = focused? icons.settingsActive: icons.settingsInactive;
                        break;
                    default:
                        source = -1;
                        break;
                };

                return (<Image style={{width: 30, height: 30, tintColor: focused? colors.accent: colors.black}} source={source}/>);
            }
        })}>
            <Tab.Screen name='Trending' component={Trending}/>
            <Tab.Screen name='Friends' component={Friends} />
            <Tab.Screen name='Create' component={MapSelection} options={{
                tabBarIcon: () => (
                    <View>
                        <Image style={styles.plus} source={icons.create}/>
                    </View>
                )
            }}/>
            <Tab.Screen name='Library' component={Library} />
            <Tab.Screen name='Settings' component={Settings} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    navBar: {
        height: 75,
        width: Dimensions.get('window').width + integers.borderWidth * 2,
        left: -integers.borderWidth,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopColor: colors.accent,
        borderRightColor: colors.accent,
        borderLeftColor: colors.accent,
        borderTopWidth: integers.borderWidth,
        borderRightWidth: integers.borderWidth,
        borderLeftWidth: integers.borderWidth,
    },
    plus: {
        height: 60,
        width: 60,
        tintColor: colors.accent,
        bottom: 24,
    }
})

export default NavBar();