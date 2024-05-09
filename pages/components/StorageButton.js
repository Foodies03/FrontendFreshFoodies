import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { colors } from "../consants";
import {MaterialCommunityIcons} from '@expo/vector-icons'

const StorageButton = (props) => {
    const primary = props.personal == true ? colors.primary : colors.shared_color
    const secondary = props.personal == true ? colors.secondary : colors.shared_background

    const iconName = props.section == 'FRIDGE' ? 'fridge-outline' :
                        props.section == 'FREEZER' ? 'ice-cream' :
                        props.section == 'PANTRY' ? 'bottle-soda-outline' :
                        'file-cabinet'

    return (
        <View style={styles.framePersonal}>
            <TouchableOpacity style={[styles.button, {borderColor: secondary}]} onPress={props.handlePress}>
                <MaterialCommunityIcons color={primary} size={120} name={iconName}></MaterialCommunityIcons>
                <Text style={{color: primary, fontWeight: '900', fontSize: 30}}>{props.section}</Text>
            </TouchableOpacity>
            <View style={[styles.extendedFrame, {backgroundColor: secondary}]}></View>
        </View>

    )
}

const styles = StyleSheet.create({
    framePersonal: {
        width: '42%',
        height: '100%',
        zIndex: '1'
    },
    extendedFrame: {
        backgroundColor: colors.secondary,
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 'auto',
        borderRadius: '10px',
        top: '3%',
        left: '5%',
        zIndex: '-1'
    },
    button: {
        width: '100%',
        height: '100%',
        zIndex: '2',
        backgroundColor: 'white',
        borderRadius: '10px',
        borderColor: colors.secondary,
        borderWidth: '3px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '15%'
    },
})

export default StorageButton

