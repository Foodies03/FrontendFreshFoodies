import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Header({ title }) {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => handleNavigation()}>
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
        height: 100, // Adjusted height
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingTop: 30,
    },
    title: {
        fontSize: 24, // Increased font size
        fontWeight: 'bold', // Bold font weight
        textAlign: 'center',
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

function handleNotificationClick() {
    // Implement your notification click functionality here
    console.log("Notification clicked!");
}

function handleMenuClick() {
    // Implement your menu click functionality here
    console.log("Menu clicked!");
}

export default Header;