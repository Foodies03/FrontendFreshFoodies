// Importing necessary components from React Native
import React, { useEffect, useState } from 'react';
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getRecommendedRecipes } from './utils/HttpUtils.js';

const importAllImages = (r) => {
  let images = {};
  r.keys().forEach((key) => (images[key.replace('./', '').split('.')[0]] = r(key)));
  return images;
};

const recipeImages = importAllImages(require.context('../assets/recipe_images', false, /\.(jpg|jpeg|png)$/));

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('All');
    const [updateCount, setUpdateCount] = useState(0);
  
    useEffect(() => {
      fetchRecommendedRecipes(); // Fetch recipes on initial load
    }, [updateCount]);
  
    const fetchRecommendedRecipes = async () => {
      try {
        const recommendedRecipes = await getRecommendedRecipes('663c5be48f6a340c1955f824', category);
        if (recommendedRecipes) {
          setRecipes(recommendedRecipes);
        } else {
          console.error('Failed to fetch recommended recipes.');
        }
      } catch (error) {
        setError(error);
        console.error('Error fetching recommended recipes:', error);
      }
    };

    const navigation = useNavigation();

    const handleRecipePress = (recipeId) => {
      navigation.navigate('RecipeScreen', {
        recipeId: String(recipeId),
      });
    };

    const updateCategory = async (newCategory) => {
      setCategory(newCategory);
      setUpdateCount((prevCount) => prevCount + 1);
    };
  
    if (error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Error occurred while fetching recipes. Please try again later.</Text>
        </View>
      );
    }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <CategoryBox imageSource={require('../assets/recipe_icons/drink-icon.png')} label="All" updateCategory={updateCategory} />
        <CategoryBox imageSource={require('../assets/recipe_icons/drink-icon.png')} label="Drinks" updateCategory={updateCategory} />
        <CategoryBox imageSource={require('../assets/recipe_icons/snack-icon.png')} label="Snacks" updateCategory={updateCategory} />
        <CategoryBox imageSource={require('../assets/recipe_icons/breakfast-icon.png')} label="Breakfast" updateCategory={updateCategory} />
        <CategoryBox imageSource={require('../assets/recipe_icons/lunch-icon.png')} label="Lunch" updateCategory={updateCategory} />
        <CategoryBox imageSource={require('../assets/recipe_icons/dinner-icon.png')} label="Dinner" updateCategory={updateCategory} />
      </View>
      <ScrollView>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Recommended</Text>
          {recipes.length === 0 ? (
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: '60%' }}>
              No recipes with matching ingredients :(
            </Text>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {recipes.map((recipe) => (
                <RecipeCard
                key={recipe._id}
                imageSource={recipeImages[recipe.name.toLowerCase().replace(/\s+/g, '-')]}
                name={recipe.name}
                onPress={() => handleRecipePress(recipe._id)}
                navigation={navigation}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const CategoryBox = ({ imageSource, label, updateCategory }) => (
  <TouchableOpacity onPress={() => updateCategory(label)}>
    <View style={{ alignItems: 'center' }}>
      <Image source={imageSource} style={{ width: 50, height: 50, marginBottom: 5, borderRadius: 15 }} />
      <Text>{label}</Text>
    </View>
  </TouchableOpacity>
);

const RecipeCard = ({ imageSource, name, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ width: '50%', padding: 10 }}>
    <View style={{ margin: 10, borderRadius: 10, overflow: 'hidden' }}>
      <Image source={imageSource} style={{ height: 175, aspectRatio: 1 }} resizeMode="cover" />
    </View>
    <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>{name}</Text>
  </TouchableOpacity>
);

export default RecipeList;