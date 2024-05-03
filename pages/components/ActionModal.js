import React, { Component, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { addEntry } from "../utils/HttpUtils";
import NumericInput from "./NumericInput";

const ActionModal = ( {item, visible, toggleModal, fridgeID, handleRender} ) => {

  const [amount, setAmount] = React.useState(item.quantity)

  useEffect(() => {
    console.log(fridgeID)
  })

  const updateAmount = (newAmount) => {
    setAmount(newAmount)
  }

  const markEntry = async (type) => {
    newEntry = {
      'fridge_id': fridgeID,
      'id' : item.id,
      'food_name': item.name,
      'category': item.category,
      'entry_type': type,
      'amount': item.quantity,
      'cost_per_unit': item.cost_per_unit,
      'creation_time': new Date()
    }
    const result = await addEntry(newEntry)

    if (result) {
      console.log('sucessfully added entry: ' + result)
      handleRender(true)
    } else {
      console.log('failed to add entry')
    }
    toggleModal()
  }

  return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            !Keyboard.isVisible() && toggleModal()
          }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => {
              !Keyboard.isVisible() && toggleModal()
            }}
          >
            <TouchableOpacity
              style={styles.modalView}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalText}>{item.name}</Text>
              {/*<NumericInput defaultAmount={amount} handleChange={updateAmount}/>*/}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons size={35} name="create-outline"></Ionicons>
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                <Ionicons size={35} name="share-outline"></Ionicons>
                  <Text>Offer Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={
                  () => {
                    markEntry('used')
                  }
                }>
                  <Ionicons size={35} name="checkmark-circle-outline"></Ionicons>
                  <Text>Mark Used</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={
                  () => {
                    markEntry('discarded')
                  }}>
                  <Ionicons size={35} name="trash-outline"></Ionicons>
                  <Text>Throw Away</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 150
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 15,
  }
});

export default ActionModal