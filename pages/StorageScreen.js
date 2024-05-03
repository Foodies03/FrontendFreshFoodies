import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { Component, useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import {
  getUserPersonalFridgeObject,
  getUserFridgeIds,
  addOrRemoveFoodFromFridge,
  getUserSharedFridgeObject
} from "./utils/HttpUtils.js";
import {colors} from "./consants.js"
import {MaterialCommunityIcons} from '@expo/vector-icons'
import BackgroundPersonal from '../assets/background/background_personal.svg'
import BackgroundShared from '../assets/background/background_shared.svg'
import ActiveIndicator from '../assets/storage/active_indicator.svg'
import ActiveIndicatorShared from '../assets/storage/active_indicator_shared.svg'
import StorageButton from "./components/StorageButton.js";
import InventoryScreen from "./InventoryScreen.js";

const StorageScreen = (navigation) => {
  const nav = useNavigation();
  const [searchTerm, setSearchTerm] = React.useState()
  const [viewingOwnFridge, setViewingOwnFridge] = React.useState(true)
  const [hasSharedFridge, setHasSharedFridge] = React.useState()
  const location = ["Fridge", "Freezer", "Pantry", "Cabinet"];
  const [rerender, setRerender] = React.useState(false)

  useFocusEffect(
    useCallback(() => {
      getUserSharedFridgeObject().then((obj) => {
        console.log('shared obj: ' + obj);
        if(obj == 'NO SHARED FRIDGE') {
          setHasSharedFridge(false)
        } else {
          setHasSharedFridge(true)
        }
      })
    },[navigation?.route?.params?.newData, rerender])
  );

  return (
    <View style={styles.form}>
      <View style={styles.searchContainer}>
          <MaterialCommunityIcons color='#718482' name='magnify' size={20} style={{marginLeft: '4%'}}></MaterialCommunityIcons>
          <TextInput style={styles.input} value={searchTerm} placeholder="Search"></TextInput>
    </View>
    <View style={styles.viewSelector}>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={{padding: '1%'}} onPress={() => setViewingOwnFridge(true)}>
          <Text style={viewingOwnFridge == true ? styles.textSelected : styles.textNotSelected}>My Fridge</Text>
        </TouchableOpacity>
        {viewingOwnFridge && <ActiveIndicator style={{marginTop: '3%'}}/>}
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={{padding: '1%'}} onPress={() => setViewingOwnFridge(false)}>
          <Text style={viewingOwnFridge == false ? styles.textSelected : styles.textNotSelected}>Everyone</Text>
        </TouchableOpacity>
        {!viewingOwnFridge && <ActiveIndicatorShared style={{marginTop: '3%'}}/>}
      </View>
    </View>
      {(viewingOwnFridge || (!viewingOwnFridge && hasSharedFridge)) && <View style={styles.container}>
        {viewingOwnFridge == true ?
          <BackgroundPersonal style={styles.background}/> :
          <BackgroundShared style={styles.background}/>
        }
        <View style={styles.row}>
            <StorageButton handlePress={() => nav.navigate('Inventory', {section: 'Fridge', personal: viewingOwnFridge})} section='FRIDGE' personal={viewingOwnFridge}></StorageButton>
            <StorageButton section='FREEZER' personal={viewingOwnFridge}></StorageButton>
          </View>
        <View style={styles.row}>
            <StorageButton section='PANTRY' personal={viewingOwnFridge}></StorageButton>
            <StorageButton section='CABINET' personal={viewingOwnFridge}></StorageButton>
        </View>
      </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    padding: "1%",
    width: "100%",
    paddingTop: '0%',
    top: '-1%'
  },
  row: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-around', // Distribute children evenly with space around them
    width: '100%', // Take the full width of the container to allow spacing around items
    height: '40%',
    marginBottom: '15%',
  },
  sort: {
    position: "sticky",
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    maxHeight: "10%",
    position: "absolute",
    right: "2%",
    top: "5%",
    zIndex: 100, // brings to front
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 35,
    paddingBottom: "1%",
  },
  form: {
    width: "100%",
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  empty: {
    height: '2em'
  },
  button: {
    width: '40%', // Width of the button, adjust based on the desired spacing and container size
    backgroundColor: 'white', // Background color of the button
    borderColor: colors.secondary,
    borderStyle: 'solid',
    borderWidth: '2x',
    padding: 20, // Padding inside the button to increase tap area
    alignItems: 'center', // Center the text inside the button
    margin: 10, // Margin around the button to ensure there's space between them
    borderRadius: 5, // Round the corners of the button
  },
  buttonText: {
    color: colors.primary,
    fontSize: '24px',
    fontWeight: '800'
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderWidth: 0,
    marginRight: 'auto'
  },
  viewSelector: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    margin: '4%',
    marginBottom: '1%'
  },
  textSelected: {
    fontSize: '18px',
    fontWeight: '600'
  },
  textNotSelected: {
    fontSize: '18px',
    color: '#00000066'
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: '5%',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: '1px',
    marginTop: '5%',
    paddingRight: '5%',
    borderColor: '#718482'
  }
});

export default StorageScreen;
