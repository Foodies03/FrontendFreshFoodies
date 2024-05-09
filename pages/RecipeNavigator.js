import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeList from './RecipeList';
import RecipeScreen from './RecipeScreen';

const Stack = createStackNavigator();

const RecipeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="RecipeList" headerMode="none">
      <Stack.Screen name="RecipeList" component={RecipeList} />
      <Stack.Screen name="RecipeScreen" component={RecipeScreen} initialParams={{ recipeId: '663b0e29ffd58bb442157944' }}/>
    </Stack.Navigator>
  );
};

export default RecipeNavigator;