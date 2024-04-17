import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation } from "@react-navigation/native";
import { makeHTTPRequest, getUserFridgeIds } from "./utils/HttpUtils.js";

function Manual(props) {
  const [name, setName] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [date, setDate] = useState(new Date());

  const [locationOpen, setlocationOpen] = useState(false);
  const [locationValue, setlocationValue] = useState(null);
  const [locationItems, setlocationItems] = useState([
    { label: "Fridge", value: "Fridge" },
    { label: "Freezer", value: "Freezer" },
    { label: "Counter", value: "Counter" },
    { label: "Pantry", value: "Pantry" },
  ]);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([
    { label: "Produce", value: "Produce" },
    { label: "Meat", value: "Meat" },
    { label: "Dairy", value: "Dairy" },
    { lavel: "Grain", value: "Grain" },
    { label: "Other", value: "Other" },
  ]);

  const navigation = useNavigation();
  const onPress = async () => {
    // if (name == null || quantity == null || categoryValue == null || locationValue == null || date == null) {
    if (
      name == null ||
      quantity == null ||
      categoryValue == null ||
      locationValue == null
    ) {
      // no date for now
      console.log("must fill out everything in the form!");
    } else {
      let newItem = {
        name: name,
        category: categoryValue,
        quantity: quantity,
        // expiration_date: date,
        location: locationValue,
      };
      var res = await addNewFoodToPersonalFridge();

      // props.navigation.setOptions([...props.route.params.data, newItem]);
      navigation.navigate("Inventory", {
        newData: newItem,
      });
    }
  };
  const handleBackBtn = () => {
    navigation.goBack();
  };

  const title = "Add Item";

  const addNewFoodToPersonalFridge = async () => {
    let fridgeId = (await getUserFridgeIds())[0];
    if (!fridgeId) {
      alert("could not get your personal fridge ID");
      return;
    }

    console.log("lsdkjfhkjsdhjklfhjklsdjkl: date " + date.toLocaleDateString());

    let foodToAdd = JSON.stringify([
      {
        slug: name,
        name: name,
        expiration_date: date,
        quantity: quantity,
        location: locationValue,
        category: categoryValue,
      },
    ]);

    console.log("food to add: " + JSON.stringify(foodToAdd));

    var requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foods: foodToAdd,
        action: "add",
      }),
    };

    var response = await makeHTTPRequest(
      requestOptions,
      process.env.EXPO_PUBLIC_API_BASE_URL + "api/fridge/" +
        fridgeId +
        "/foods"
    );
    if (response === null) {
      alert("failed to get your personal fridge items.");
    }
    console.log(response);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn2} onPress={handleBackBtn}>
        <Text style={styles.text}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.formTitle}>Add Item</Text>
      <Text style={styles.form}>Food Name:</Text>
      <TextInput
        editable
        maxLength={40}
        value={name}
        placeholder="Enter a food name"
        onChangeText={setName}
        autoCapitalize="none"
        style={styles.textInput}
      />
      <Text style={styles.form}>Quantity:</Text>
      <TextInput
        editable
        maxLength={2}
        value={quantity}
        placeholder="Enter quantity"
        onChangeText={setQuantity}
        style={styles.textInput}
        keyboardType="numeric"
      />
      <Text style={styles.form}>Expiration Date:</Text>
      <DateTimePicker
        value={date}
        mode="date" //The enum of date, datetime and time
        placeholder="Select date"
        dateFormat="YYYY-MM-DD"
        minimumDate={date}
        confirmBtnText="confirm"
        cancelBtnText="cancel"
        onDateChange={(newDate) => {
          setDate(newDate);
        }}
        style={{
          width: "100%",
          // backgroundColor: 'white'
        }}
        customStyles={{
          dateInput: {
            paddingLeft: 5,
            alignItems: "flex-start",
            borderRadius: 10,
            height: "100%",
            borderColor: "grey",
          },
        }}
      />
      <Text style={styles.form}>Category</Text>
      <View style={styles.dropdownCtner1}>
        <DropDownPicker
          open={categoryOpen}
          value={categoryValue}
          items={categoryItems}
          setOpen={setCategoryOpen}
          setValue={setCategoryValue}
          setcategoryItems={setCategoryItems}
          placeholder="Select category"
          style={{
            zIndex: 10,
            position: "relative",
            borderColor: "grey",
            backgroundColor: "white",
          }}
          dropDownContainerStyle={{ zIndex: 3000 }}
          itemStyle={{ color: "grey" }}
        />
      </View>
      <Text style={styles.form}>Location</Text>
      <View style={styles.dropdownCtner2}>
        <DropDownPicker
          open={locationOpen}
          value={locationValue}
          items={locationItems}
          setOpen={setlocationOpen}
          setValue={setlocationValue}
          setcategoryItems={setlocationItems}
          placeholder="Select location"
          style={{
            zIndex: 0,
            position: "relative",
            borderColor: "grey",
            backgroundColor: "white",
          }}
          dropDownContainerStyle={{ zIndex: 0 }}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: "10%",
    backgroundColor: "white",
  },
  formTitle: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
  form: {
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  textInput: {
    color: "black",
    padding: 13,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "grey",
    backgroundColor: "white",
  },
  dropdownCtner1: {
    zIndex: 3000,
  },
  dropdownCtner2: {
    zIndex: 2000,
  },
  btn: {
    backgroundColor: "#2FC6B7",
    justifyContent: "center",
    borderRadius: 10,
    width: 200,
    alignSelf: "center",
    padding: 20,
    margin: 20,
  },
  btn2: {
    backgroundColor: "#2FC6B7",
    borderRadius: 10,
    width: 100,
    position: "absolute",
    padding: 10,
    margin: 20,
    top: 75,
    left: 25,
  },
  text: {
    fontSize: 20,
    color: "#FFFFFF",
    alignSelf: "center",
  },
});

export default Manual;
