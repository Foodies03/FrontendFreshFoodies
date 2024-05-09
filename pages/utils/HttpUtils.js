import AsyncStorage from "@react-native-async-storage/async-storage";

// returns null if the request failed. Will print and alert any errors.
export const makeHTTPRequest = async (requestOptions, url) => {
    // console.log("making request: " + JSON.stringify(requestOptions))
    var response;
    try {
        response = await fetch(url, requestOptions)
    } catch (e) {
        console.log('fetch error:', e.message)
        return null;
    }

    if (response.status && response.status != 200) {
        response = await response.text()
        console.log("request not 200 OK! response: " + response);
        alert(response)
        return null;
    }

    response = await response.json();

    // console.log("request succeeded, response: " + JSON.stringify(response))
    return response
}

export const getUserPersonalFridgeObject = async () => {
    let fridgeIds = await getUserFridgeIds();
    let personalFridgeId = fridgeIds[0];
    var requestOptions = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      };

    var response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL + "api/fridge/" + personalFridgeId);
    if (response === null) {
        alert("failed to get your fridge.")
        return;
      }
      // console.log(JSON.stringify(response));
      return response;
}

export const getUserFridgeIds = async () => {
  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "email" : await AsyncStorage.getItem("user_email")
    })
  };

  var response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL + "api/me");
  if (response === null) {
    alert("failed to get your login info.")
    return;
  }
  // console.log("api/me response: " + JSON.stringify(response));
  return response.fridge_ids
}

export const getUserSharedFridgeObject = async () => {
  let fridgeIds = await getUserFridgeIds();
  if (fridgeIds.length < 2) {
    return "NO SHARED FRIDGE"
  }
  let sharedFridgeId = fridgeIds[1];
  var requestOptions = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  };

  var response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL + "api/fridge/" + sharedFridgeId);
  if (response === null) {
      alert("failed to get your fridge.")
      return;
    }
    // console.log(JSON.stringify(response));
    return response;
}

export const getEntries = async ( timeFrame ) => {
  const date = new Date()
  date.setDate(date.getDate() - timeFrame)
  console.log(date)

  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "email" : await AsyncStorage.getItem("user_email"),
      "time_frame" : date
    })
  }

  var response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL + "api/user/entries");
  if (response === null) {
    alert("failed to get entries")
    return;
  }

  console.log("sucessfully recieved entries")
  return response
}

export const addEntry = async ( entryDetails ) => {
  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "email" : await AsyncStorage.getItem("user_email"),
      "entry_details" : entryDetails
    })
  };

  var response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL + "api/user/add_entry");
  if (response === null) {
    alert("failed to add entry.")
    return;
  }
  console.log("api/user/add_entry response: " + JSON.stringify(response));
  return response
}

export const addOrRemoveFoodFromFridge = async (fridgeId, foodArray, action) => {
  var requestOptions = {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "foods": JSON.stringify(foodArray),
      "action": action
    })
  };

  var response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL + "api/fridge/" + fridgeId + "/foods")
  if (response === null) {
    alert("failed to add or remove foods")
    return
  }
  // console.log(JSON.stringify(response))
  return response;
}

export const createFridge = async (email, slug) => {
  console.log("creating fridge", email, slug)
  var body = {
    email,
    slug
  }
  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  var response = makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL + "api/fridge");

  if (!response) {
    alert("fridge creation failed")
    return;
  }

  // console.log("fridge creation succeeded, response: " + JSON.stringify(response))
}

export const getRecommendedRecipes = async (fridgeId, category) => {

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeHTTPRequest(requestOptions, process.env.EXPO_PUBLIC_API_BASE_URL + "api/fridge/" + fridgeId + "/recommended_recipes?category=" + category);
    if (response === null) {
      alert('Failed to get recommended recipes.');
      return null;
    }
    return response;
  } catch (error) {
    console.error('Error fetching recommended recipes:', error.message);
    return null;
  }
};

export const getRecipeDetails = async (fridgeId, recipeId) => {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL + "api/fridge/" + fridgeId + "/recipes/" + recipeId;
  const requestOptions = {
      method: 'GET',
      headers: {
          "Content-Type": "application/json"
      }
  };

  try {
      const response = await makeHTTPRequest(requestOptions, url);
      if (response === null) {
          console.log("Failed to fetch recipe details.");
          return null;
      }
      return response;
  } catch (error) {
      console.error("Error fetching recipe details:", error.message);
      return null;
  }
};

export const sendServingsToBackend = async (servings, fridgeId, recipeId) => {
  const url = process.env.EXPO_PUBLIC_API_BASE_URL + "api/fridge/" + fridgeId + "/recipes/" + recipeId + "/servings";
  const requestOptions = {
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ servings, recipeId }),
  };

  try {
      const response = await makeHTTPRequest(requestOptions, url);
      if (response === null) {
          console.log("Failed to send servings to server.");
          return null;
      }
      return response;
  } catch (error) {
      console.error("Error sending servings to server:", error.message);
      return null;
  }
};