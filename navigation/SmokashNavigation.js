import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
    createBottomTabNavigator,
    createTabNavigator,
} from "react-navigation-tabs";
import Home from "../screens/Home";
import Overall from "../screens/Overall";
import ConfigScreen from "../screens/ConfigScreen";
import SettingsScreen from "../screens/SettingsScreen";

const HomeNavigator = createStackNavigator({
    Home: Home,
});

const OverallNavigator = createStackNavigator({
    Overall: Overall,
});

const ConfigNavigator = createStackNavigator({
    Settings: SettingsScreen,
    Config: ConfigScreen,
});

const SmokashTabNavigator = createBottomTabNavigator({
    Home: {
        screen: HomeNavigator,
        navigationOptions: {
            tabBarLabel: "",
            tabBarIcon: (tabInfo) => {
                return ( <
                    Ionicons name = 'md-home'
                    size = { 26 }
                    color = { tabInfo.tintColor }
                    />
                );
            },
        },
    },
    Overall: {
        screen: OverallNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return ( <
                    Ionicons name = 'md-calendar'
                    size = { 26 }
                    color = { tabInfo.tintColor }
                    />
                );
            },
        },
    },
    Config: {
        screen: ConfigNavigator,
        navigationOptions: {
            tabBarLabel: "",
            tabBarIcon: (tabInfo) => {
                return <Ionicons name = 'md-cog'
                size = { 26 }
                color = { tabInfo.tintColor }
                />;
            },
        },
    },
}, {
    tabBarOptions: {
        activeTintColor: "#C60000",
        showLabel: false,
    },
}, );

export default createAppContainer(SmokashTabNavigator);