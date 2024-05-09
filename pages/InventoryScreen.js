import React, { useCallback, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StorageImage from '../assets/StorageTitle.png';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
    getUserPersonalFridgeObject,
    getUserFridgeIds,
    addOrRemoveFoodFromFridge,
    getUserSharedFridgeObject,
  } from "./utils/HttpUtils.js";
import InventoryItem from './components/InventoryItem.js'
import ActionModal from "./components/ActionModal.js";

const InventoryScreen = (props) => {
    const section = props.route.params.section;
    const viewingOwnFridge = props.route.params.personal;
    const [foods, setFoods] = React.useState([])
    const navigation = useNavigation();
    const [rerender, setRerender] = React.useState([false])
    const [editing, setEditing] = React.useState([false])
    const [currItem, setCurrItem] = React.useState({})
    const [fridgeID, setFridgeID] = React.useState()

    useEffect(() => {
        console.log('viewing own fridge: ' + viewingOwnFridge)
        console.log('section: ' + section)
       const setId = async () => {
        try {
            const fridgeIds = await getUserFridgeIds()
            viewingOwnFridge ? setFridgeID(fridgeIds[0]) : setFridgeID(fridgeIds[1])
            console.log(fridgeID)
        } catch {
            console.log('failed to get fridge ids')
        }
       }

       setId()
    }, [])

    useFocusEffect(
        useCallback(() => {
          if (viewingOwnFridge) {
            getUserPersonalFridgeObject().then((obj) => {
                const foods = obj.foods;
                // this is the food object, and is an array of object like this:
                // {"category":"produce","location":"fridge","name":"apple","quantity":1,"slug":"apple"}
                const filteredItems = foods.filter(item => item.location == section)
                console.log(filteredItems)
                setFoods(filteredItems);
                setRerender(false);
              });
          } else {
            getUserSharedFridgeObject().then((obj) => {
                const foods = obj.foods;
                // this is the food object, and is an array of object like this:
                // {"category":"produce","location":"fridge","name":"apple","quantity":1,"slug":"apple"}
                const filteredItems = foods.filter(item => item.location == section)
                console.log(filteredItems)
                setFoods(filteredItems);
                setRerender(false);
              });
          }
        },[navigation?.route?.params?.newData, rerender])
    );

    const handleRemove = async (item) => {
        console.log('removing ' + item.name)
        const fridgeIds = await getUserFridgeIds();
        await addOrRemoveFoodFromFridge(fridgeIds[0], [item], "remove");
        console.log('printing item ' + item.id)
        setRerender(true)
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{section}</Text>
            </View>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={24} color="black" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchBar}
                        placeholderf="Search all"
                        placeholderTextColor="#888"
                    />
                </View>
                <ScrollView >
                    <View>
                        <ImageBackground
                            source={StorageImage}
                            style={{width:"100%", height:60}}
                            resizeMode="cover"
                        >
                            <Text style={styles.storageText}>Fruit</Text>
                        </ImageBackground>

                        <View style={styles.headerRow}>
                            <Text style={styles.headerText}>Food</Text>
                            <Text style={styles.headerText}>Amount</Text>
                            <Text style={styles.headerText}>Expiration</Text>
                            <Text style={styles.headerText}>Action</Text>
                        </View>
                        {foods.map((item, index) => {
                            return <InventoryItem onPress={() => {
                                setEditing(true)
                                setCurrItem(item)
                            }} name={item.name} amount={item.quantity} expiration={item.expiration_date}/>
                        })}
                        <ImageBackground
                            source={StorageImage}
                            style={{width:"100%", height:60}}
                            resizeMode="cover"
                        >
                            <Text style={styles.storageText}>Pantry</Text>
                        </ImageBackground>

                        <View style={styles.headerRow}>
                            <Text style={styles.headerText}>Food</Text>
                            <Text style={styles.headerText}>Amount</Text>
                            <Text style={styles.headerText}>Expiration</Text>
                            <Text style={styles.headerText}>Action</Text>
                        </View>
                        {/* {foods.map((item, index) => {
                            renderInventoryItem(item.name, item.quantity, item.expiration_date)
                        })} */}
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.addItemButton} onPress={() => navigation.navigate("Manual")}>
                    <Text style={styles.addItemButtonText}>Add Item</Text>
                </TouchableOpacity>
                <ActionModal handleRender={setRerender} item={currItem} visible={editing} toggleModal={() => setEditing(false)} fridgeID={fridgeID}/>
        </View>
    );
}


const styles = StyleSheet.create({
    storageText: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        paddingTop: 10,
        fontWeight:"bold",
    },
    headerRow: {
        backgroundColor: '#808080',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    inventoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 12,
    },
    inventoryItemText: {
        flex: 1,
        textAlign: 'center',
    },
    expiredInventoryItemText: {
        color: 'red'
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
    },
    addItemButton: {
        backgroundColor: '#FFC531',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginTop: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 15
    },
    addItemButtonText: {
        color: 'white',
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        marginHorizontal: 30,
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
    },
    title: {
        alignSelf: 'center',
        fontWeight: '600',
        fontSize: 20
    },
    titleContainer: {
        alignItems: 'center',
        paddingTop: '3%'
    }
});

export default InventoryScreen;
