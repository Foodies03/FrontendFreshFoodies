import React, { useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { getRecipeDetails } from './utils/HttpUtils.js';
import { ScrollView } from 'react-native';
import { getUserPersonalFridgeObject } from './utils/HttpUtils.js';
import { sendServingsToBackend } from './utils/HttpUtils.js';
import MinusIcon from '../assets/recipe_icons/minusIcon.png';
import PlusIcon from '../assets/recipe_icons/plusIcon.png';
import FoodImage from '../assets/recipe_images/food.jpg';

const importAllImages = (r) => {
    let images = {};
    r.keys().forEach((key) => (images[key.replace('./', '').split('.')[0]] = r(key)));
    return images;
};
  
const recipeImages = importAllImages(require.context('../assets/recipe_images', false, /\.(jpg|jpeg|png)$/));

const RecipeScreen = ({navigation, route}) => {
  const [activeButton, setActiveButton] = useState('Ingredients');
  const [recipe, setRecipe] = useState([]);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(1);
  const [userFridge, setUserFridge] = useState([]);
  const [fridgeId, setFridgeId] = useState(0);

  const { recipeId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Getting Recipe Details
        // TODO: REPLACE THE HARD-CODED ID WITH USER ID
        const tempFridgeId = '663c5be48f6a340c1955f824';
        setFridgeId(tempFridgeId);

        const recipeDetails = await getRecipeDetails(fridgeId, recipeId);
        if (recipeDetails) {
          setRecipe([recipeDetails]);
        } else {
          console.error('Failed to fetch recipe details.');
        }

        // Getting users inventory
        const fridgeObject = await getUserPersonalFridgeObject();
        if (fridgeObject) {
            setUserFridge(fridgeObject.foods.map(({ name, quantity }) => ({ name, quantity })));
        } else {
            console.error('Failed to fetch user personal fridge object.');
        }

      } catch (error) {
        setError(error);
        console.error('Error fetching recipe details:', error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error occurred while fetching recipe details. Please try again later.</Text>
      </View>
    );
  }

  const updatedFridgeInventory = () => {
    const currentFridge = JSON.parse(JSON.stringify(userFridge));
    const updatedFridge = [];
  
    recipe[0].recipe.ingredients.forEach(({ ingredient, amount, unit }) => {
      const fridgeItem = currentFridge.find((item) => item.name === ingredient);
      if (fridgeItem) {
        let newUnit = unit;
  
        if (unit.toLowerCase() === 'to taste') {
          newUnit = 'x';
        }
  
        const tempQuantity = fridgeItem.quantity - amount * servings;
        const newQuantity = tempQuantity >= 0 ? tempQuantity : 0;
        if (newQuantity <= 0) {
          fridgeItem.quantity = 'No';
          newUnit = '';
        } else {
          fridgeItem.quantity = newQuantity;
        }
        fridgeItem.unit = newUnit;
        updatedFridge.push(fridgeItem);
      }
    });
  
    return updatedFridge.map(({ quantity, unit, name }) => {
      if (unit === "") {
        return `${quantity} ${name}`;
      } else {
        return `${quantity} ${unit} ${name}`;
      }
    }).join('\n');
  };

  const handleMinusClick = () => {
    if (servings > 1) {
        setServings(servings - 1);
    }
  };

  const handlePlusClick = () => {
    setServings(servings + 1);
  };

  const handleCompleteClick = async () => {
    try {
        const servingsSent = await sendServingsToBackend(servings, fridgeId, recipe[0].recipe._id);
        if (servingsSent) {
          alert('Successfully updated inventory!');
        } else {
          alert('Failed to send servings to server.');
        }
    } catch (error) {
    console.error('Error sending servings to server:', error);
    alert('Error sending servings to server.');
    }
  };

  const handleWhatsLeftClick = () => {
    alert("Clicked!");
  };

  return (
    <View style={{ flex: 1 }}>
        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
        {recipe.length > 0 && (
            <Image
            source={recipeImages[recipe[0].recipe.name.toLowerCase().replace(/\s+/g, '-')]}
            style={{ borderRadius: 75, width: 200, height: 200, marginTop: '20%' }}
            />
        )}
        </View>

        <View style={{ flex: 0.5, width: '75%', alignSelf: 'center', position:'absolute', top: '45%', zIndex:100}}>
            <View style={{ backgroundColor: '#169a54', borderRadius: 10, padding: 10, alignItems: 'center' }}>

                {recipe.length > 0 && (
                    <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold' }}>{recipe[0].recipe.name}</Text>
                )}

                {recipe.length === 0 && (
                    <Text>Loading...</Text>
                )}

                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10, marginRight: 10 }}>
                    <TouchableOpacity onPress={() => setActiveButton('Ingredients')} style={[styles.button, activeButton === 'Ingredients' && styles.activeButton, styles.leftRadius]}>
                        <Text style={[styles.buttonText, activeButton === 'Ingredients' && styles.activeButtonText]}>Ingredients</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveButton('Instructions')} style={[styles.button, activeButton === 'Instructions' && styles.activeButton]}>
                        <Text style={[styles.buttonText, activeButton === 'Instructions' && styles.activeButtonText]}>Instructions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveButton('WhatsLeft')} style={[styles.button, activeButton === 'WhatsLeft' && styles.activeButton, styles.rightRadius]}>
                        <Text style={[styles.buttonText, activeButton === 'WhatsLeft' && styles.activeButtonText]}>What's Left</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>

        <View style={{flex:1, justifyContent: 'flex-end'}}>
            <View style={{ flex: 1, backgroundColor: '#1CC16A', marginTop: "30%", justifyContent: 'center', alignItems: 'center'}}>
            
            {recipe.length > 0 && (
                <>
                    {activeButton === 'Ingredients' && (
                    <View style={{ backgroundColor: '#ffffff', width: '85%', height: '80%', borderRadius: 10, paddingLeft: 10, paddingTop: 20, marginTop: '12%' }}>
                        <TouchableOpacity onPress={handleMinusClick} style={{ position: 'absolute', top: '5%', right: '27%', zIndex: 100}}>
                            <Image source={MinusIcon} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePlusClick} style={{ position: 'absolute', top: '6%', right: '6%', zIndex: 100}}>
                            <Image source={PlusIcon} style={{ width: 35, height: 35 }} />
                        </TouchableOpacity>
                        <View style={{ position: 'absolute', top: '9%', right: '10%', paddingBottom:5, backgroundColor: '#ffc531', width: '25%', borderRadius: 10, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ ...styles.servingButtonText, fontSize: 18 }}>{servings}</Text>
                            <Text style={{ ...styles.servingButtonText, fontSize: 12 }}>servings</Text>
                        </View>

                        <ScrollView>
                        {recipe[0].recipe.ingredients.map((ingredient, index) => {
                            const itemName = ingredient.ingredient;
                            const itemQuantity = ingredient.amount * servings;

                            // Check if userFridge contains the item and its quantity is sufficient
                            const isInInventory = userFridge.some(item => item.name === itemName && item.quantity >= itemQuantity);

                            // Define styles based on the condition
                            const textStyle = {
                            padding: 5,
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: isInInventory ? '#000000' : 'red', // Make text red if not in inventory
                            };

                            return (
                            <Text key={index} style={textStyle}>
                                {ingredient.amount === 0 ? `${ingredient.ingredient} ${ingredient.unit}` : `${itemQuantity} ${ingredient.unit} ${ingredient.ingredient}`}
                            </Text>
                            );
                        })}
                        </ScrollView>
                    </View>
                    )}

                    {activeButton === 'Instructions' && (
                        <View style={{ backgroundColor: '#ffffff', width: '85%', height: '80%', borderRadius: 10, alignItems: 'center', marginTop: '12%' }}>
                            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                                <Text style={{ paddingTop: 15, fontSize: 20, color: '#000000', fontWeight: 'bold' }}>Prep Time: {recipe[0].recipe.prep_time}</Text>
                                <Text style={{ padding: 15, fontSize: 20, color: '#000000' }}>{recipe[0].recipe.directions}</Text>
                                <TouchableOpacity onPress={handleCompleteClick} style={{...styles.specialButton, marginTop: 20, marginBottom: 20 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000' }}>Complete!</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    )}

                    {activeButton === 'WhatsLeft' && (
                        <View style={{ backgroundColor: '#ffffff', width: '85%', height: '80%', borderRadius: 10, marginTop: '12%' }}>
                            <ScrollView style={{ padding: 10 }}>
                              <Text style={{ paddingTop: 8, paddingLeft: 5, paddingBottom: 5, fontSize: 16, color: '#000000', fontWeight: 'bold' }}>After completing this recipe, you will have:</Text>
                              {updatedFridgeInventory().split('\n').map((line, index) => (
                                <Text key={index} style={{ padding: 5, fontSize: 18, fontWeight: 'bold', color: '#000000' }}>{line}</Text>
                              ))}
                              <TouchableOpacity onPress={handleWhatsLeftClick} style={{...styles.specialButton, marginBottom: 30, marginTop: 20, marginRight: 10, marginLeft: 'auto' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', textAlign: 'center' }}>View Storage</Text>
                              </TouchableOpacity>
                            </ScrollView>
                        </View>
                    )}
                </>
            )}

            {recipe.length === 0 && (
                <Text>Loading...</Text>
            )}

            </View>
        </View>
    </View>
  );
};

const styles = {
  button: {
    backgroundColor: '#ffffff',
    padding: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: '#000000',
  },
  activeButtonText: {
    color: '#ffffff',
  },
  leftRadius: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  rightRadius: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  specialButton: {
    backgroundColor: '#ffc531',
    padding: 10,
    width: '40%',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  servingButtonText: {
    fontWeight: 'bold',
    color: 'white',
    // textShadowColor: 'black',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  }
};

export default RecipeScreen;