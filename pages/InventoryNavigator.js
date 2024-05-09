import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StorageScreen from "./StorageScreen";
import InventoryScreen from "./InventoryScreen";

const Stack = createNativeStackNavigator();

const InventoryNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Storage" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Storage Navigation" component={StorageScreen}/>
            <Stack.Screen name="Inventory" component={InventoryScreen}/>
        </Stack.Navigator>
    )
}

export default InventoryNavigator