import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';

const NumericInput = ( {defaultAmount, handleChange} ) => {
  const [amount, setAmount] = useState(defaultAmount)
  const inputRef = useRef(null);

  const handleOutsideTap = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const onChange = (amount) => {
    setAmount(amount)
    handleChange(amount)
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsideTap}>
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={amount}
          onChangeText={onChange}
          keyboardType="numeric"
          placeholder=""
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    padding: 10,
  },
});

export default NumericInput;
