import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FridgeIcon from '../assets/fridgeicon.png';
import OfferIcon from '../assets/offericon.png';

// Define the function to generate notifications
function generateNotifications() {
    // Sample notifications
    const notifications = [
      { type: 'expiration', item: 'Chicken' },
      { type: 'expiration', item: 'Cookies' },
      { type: 'offer', item: 'Bananas', person: 'Mark' }
    ];
  
    return notifications.map((notification, index) => {
      let message;
      let itemStyle = {};
      let iconImage;
  
      if (notification.type === 'expiration') {
        message = `has expired. Time to throw it away!`;
        itemStyle = { color: 'red' };
        iconImage = FridgeIcon;
      } else if (notification.type === 'offer') {
        message = `have been offered by ${notification.person}!`;
        itemStyle = { color: 'red' };
        iconImage = OfferIcon;
      }
  
      return (
        <TouchableOpacity key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }} onPress={() => console.log('Notification clicked!')}>
          <Image source={iconImage} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={[{ fontWeight: 'bold' }, itemStyle]}>{notification.item} <Text style={{ color: '#333', fontWeight: 'bold' }}>{message}</Text></Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
      );
    });
  }
  
  // Define the NotificationScreen component
  function NotificationScreen() {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1, borderTopWidth: 1, borderTopColor: '#ccc' }}>
          {generateNotifications()}
        </View>
        <View style={{ paddingBottom: 20, alignItems: 'center' }}>
          <TouchableOpacity style={styles.clearButton} onPress={() => console.log('Clear button pressed!')}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  // Define StyleSheet
  const styles = StyleSheet.create({
    clearButton: {
      width: '40%',
      height: 50,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'yellow',
      borderWidth: 2,
    },
    buttonText: {
      color: 'yellow',
      fontSize: 20,
      fontWeight: 'bold',
    }
  });
  
  export default NotificationScreen;