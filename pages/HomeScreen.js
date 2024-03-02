import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import InventoryScreen from './InventoryScreen';
import StorageScreen from './StorageScreen';
import AnalyticsScreen from './AnalyticsScreen';
import ScanReceiptScreen from "./ScanReceiptScreen";
import LogoutScreen from "./LogoutScreen";
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from './Header';
import InventoryNavigator from "./InventoryNavigator";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [offer, setOffer] = React.useState(0);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          header: ({ navigation, route, options }) => {
                const title = route.name;
                return <Header title={title} />;
            },
          tabBarStyle: {
            backgroundColor: '#F8F8F8',
            borderTopWidth: 2
          },
          tabBarActiveTintColor: '#2FC6B7',
          tabBarInactiveTintColor: 'black',
        }}
        >
        <Tab.Screen
          name="Storage"
          component={InventoryNavigator}
          options={{
            tabBarLabel: '',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="fridge-outline" color={color} size={35} />
            ),
          }}
          initialParams={{}}
        />
        <Tab.Screen
          name="Scanner"
          component={ScanReceiptScreen}
          options={{
            tabBarLabel: '',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <AntDesign name="scan1" color={color} size={35} />
            ),
          }}
        />
        <Tab.Screen
          name="Analytics"
          options={{
            tabBarLabel: '',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="google-analytics" color={color} size={30} />
            ),
          }}
          children={() => <AnalyticsScreen offer={offer+1} />}
        />
        <Tab.Screen
          name="Logout"
          component={LogoutScreen}
          options={{
            tabBarLabel: '',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="user" color={color} size={30} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default HomeScreen

