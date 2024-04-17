import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { colors } from "../consants";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';

const InventoryItem = (props) => {

    const [viewingAction, setViewingAction] = React.useState(false)
    const [rerender, setRerender] = React.useState([false]);

    const expired = new Date(props.expiration).toLocaleDateString() < new Date().toLocaleDateString()

    return (
        <View style={[styles.inventoryItem, expired && {borderWidth: '1px', borderColor: 'red', 'borderBottomColor': 'red'}]}>
            <Text style={[styles.inventoryItemText, expired && styles.expiredInventoryItemText]}>{props.name}</Text>
            <Text style={[styles.inventoryItemText, expired && styles.expiredInventoryItemText]}>{props.amount}</Text>
            <Text style={[styles.inventoryItemText, expired && styles.expiredInventoryItemText]}>{new Date(props.expiration).toLocaleDateString()}</Text>
            {!viewingAction &&
                <TouchableOpacity style={styles.actionButton} onPress={() => setViewingAction(true)}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                </TouchableOpacity>
            }
            {viewingAction &&
                <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={() => setViewingAction(false)}>
                        <MaterialCommunityIcons name='pencil' size={24} color='black'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#FFC531', borderRadius: '50%'}} onPress={() => setViewingAction(false)}>
                        <MaterialCommunityIcons name='share-all' size={24} color='black'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: 'red', borderRadius: '50%'}} onPress={() => props.removeItem}>
                        <MaterialCommunityIcons name='delete-forever' size={24} color='black'/>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    inventoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 12,
        alignContent: 'space-between'
    },
    inventoryItemText: {
        flex: 1,
        textAlign: 'center',
    },
    expiredInventoryItemText: {
        color: 'red'
    },
    actionButton: {
        flex: 1.2,
        alignItems: 'center',
    },
    actionContainer: {
        flex:1.2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    innerActionButton: {
        borderRadius: '50%',
        borderWidth: '1px',
    }
});

export default InventoryItem