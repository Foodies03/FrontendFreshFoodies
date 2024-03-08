import React, { Component, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, Modal } from "react-native";
import OfferUpItemList from "./OfferUpItemList";
import SortDropDown from "./SortDropDown";
import { useNavigation } from "@react-navigation/native";
import {
  getUserPersonalFridgeObject,
  getUserFridgeIds,
  addOrRemoveFoodFromFridge,
} from "./utils/HttpUtils.js";

const OfferUpModal = ( { visible, handleClose, foodDetails, fridgeIds } ) => {

    const handleOfferUp = async () => {
        console.log(foodArray);
        const fridgeIds = await getUserFridgeIds();
        console.log("FRIDGE IDS: " + fridgeIds);
        setfoodArray([]);
        let foodNameArray = [];
        for (let i = 0; i < foodArray.length; i++) {
          foodNameArray.push(foodArray[i].slug)
        }
        await addOrRemoveFoodFromFridge(fridgeIds[0], foodNameArray, "remove");
        await addOrRemoveFoodFromFridge(fridgeIds[1], foodArray, "add")
        nav.goBack()
      };

    return (
       <Modal visible={visible} onClose={async () => {
            await handleOfferUp()
            handleClose()
       }
       }>

       </Modal>
    )
}

const styles = StyleSheet.create({

})

export default OfferUpModal;