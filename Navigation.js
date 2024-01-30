import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

//screens
import HomeScreen from './screens/HomeScreen';
import DataScreen from './screens/DataScreen';
import StackScreen from './screens/StackScreen';
import PredictionScreen from './screens/PredictionScreen';

const HomeStackNavigator = createNativeStackNavigator();

function MyStack(){
    return(
        <HomeStackNavigator.Navigator
            initialRouteName="Inicio"
        >
            <HomeStackNavigator.Screen
                name="Inicio"
                component={HomeScreen}
            />
            <HomeStackNavigator.Screen
                name="Stack"
                component={StackScreen}
            />
        </HomeStackNavigator.Navigator>
    );
}

const Tab = createBottomTabNavigator();

function MyTabs(){
    return(
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                //tabBarActiveTintColor:'purple',
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={MyStack}
                options={{
                    tabBarLabel:'Inicio',
                    tabBarIcon:({color,size})=>(
                        <MaterialCommunityIcons name="home" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen 
                name="Datos del panel" 
                component={DataScreen}
                options={{
                    tabBarLabel:'Datos',
                    tabBarIcon:({color,size})=>(
                        <FontAwesome6 name="solar-panel" size={size} color={color} />
                    ),
                    //headerShown: false,
                }}
            />
            <Tab.Screen 
                name="Graficas de predicción" 
                component={PredictionScreen}
                options={{
                    tabBarLabel:'Predicciones',
                    tabBarIcon:({color,size})=>(
                        <Entypo name="bar-graph" size={size} color={color} />
                    ),
                    //headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}

export default function Navigation(){
    return(
        <NavigationContainer>
            <MyTabs/>
        </NavigationContainer>
    );
}