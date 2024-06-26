import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import NotificationScreen from './NotificationScreen';

function Header({ title }) {
    const nav = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => nav.goBack()}>
                <Ionicons name="arrow-back" size={40} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.rightIcons}>
                <TouchableOpacity onPress={() => handleNotificationClick()}>
                    <Ionicons name="notifications" size={24} color="black" paddingHorizontal={10}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                    <Ionicons name="menu" size={32} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

function handleNotificationClick() {
    console.log("Notification clicked!");
}

function handleMenuClick() {
    console.log("Menu clicked!");
}

export default Header;