import { calculateBMR, calculateTDEE } from "./calculator.js";
import { checkDiet, filterOutElements, processRandomRecipe, processRecipeResponseSpoonacular } from "./helper.js";
import { calculateMacronutrients } from "./calculator.js";
import { createRequestMessage } from "./helper.js";
import { processRecipeString } from "./helper.js";
import { scaleGPTMeals } from "./calculator.js";
import { ingredientsList, veggieList, seafoodList, veganList} from "./lists.js";
import { getRecipeID } from "./helper.js";
import dotenv from 'dotenv';
import e from "express";
dotenv.config();

var BACKEND_URL
if (process.env.NODE_ENV === "production") {
  BACKEND_URL = `${process.env.PROD_URL}:${process.env.PORT}`
} else if (process.env.NODE_ENV === "development") {
  BACKEND_URL = `${process.env.DEV_URL}:${process.env.PORT}`
}

export async function getGPTRecipe(inputData) {
  var burntCalories = 0;
  const {
    age,
    weight,
    height,
    gender,
    activityLevel,
    mealAmount,
    breakfast,
    lunch,
    dinner,
    diet,
    likedIngredients,
    excludedIngredients,
  } = inputData;

  var totalCalories = 0;
  var macronutrients;

  const bmr = calculateBMR(
    parseInt(weight),
    parseInt(height),
    parseInt(age),
    gender
  );
  const tdee = calculateTDEE(bmr, activityLevel);
  totalCalories = tdee + burntCalories;
  macronutrients = calculateMacronutrients(totalCalories);


  const type = [];
  if (breakfast) type.push("breakfast");
  if (lunch) type.push("lunch");
  if (dinner) type.push("dinner");
  var recipes = []

  for (let mealType of type) {

    const message = createRequestMessage(
      mealType,
      excludedIngredients,
      likedIngredients,
      diet
    );

    const messages = [];

    const messageText = message;
    const newMessage = { role: "user", content: messageText };
    messages.push(newMessage);
    console.log(newMessage)


    const data = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const newAssistantMessage = {
          role: "assistant",
          content: data.completion.content,
        };
        messages.push(newAssistantMessage);

        const stringWithJSONArray = data.completion.content;

        //console.log("START", stringWithJSONArray, "END")
        var dataJson;
        try {
          dataJson = extractJSONArrayFromString(stringWithJSONArray);
        } catch (error) {
          console.error(error.message);
        }

        // FOR IMAGE

        dataJson = scaleGPTMeals(totalCalories, dataJson);

        return dataJson;

      })
      .catch((error) => {
        console.log("Error:", error);
      });

    recipes.push(data);
  }


  for (const recipe of recipes) {
    const imgURL = await getImgURL(recipe.name, recipe.ingredients);
    console.log("IMG URL: \n" + imgURL + "\n\n\n");
    recipe.imgURL = imgURL;
  }

  return recipes;
}

function extractJSONArrayFromString(str) {
  // Find the starting and ending positions of the JSON array
  console.log("BEFORE\n", str, "\nBEFORE\n")
  const startIndex = str.indexOf('{');
  const endIndex = str.lastIndexOf('}');

  // If startIndex or endIndex is -1, that means the JSON array is not found in the string
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('JSON array not found in the string.');
  }

  // Extract the JSON array substring
  const jsonArrayString = str.substring(startIndex, endIndex + 1);
  console.log("JSON ARRAY STRING\n", jsonArrayString, "\nJSON ARRAY END\n")
  try {
    // Parse the JSON array and return the result
    const jsonArray = JSON.parse(jsonArrayString);
    return jsonArray;
  } catch (error) {
    throw new Error('Failed to parse the JSON array.');
  }
}



async function getImgURL(recipeName, ingredients) {

  var reqMsg = "";

  reqMsg += `${recipeName}, ingredients: `

  for (let ingredient of ingredients) {
    reqMsg += ingredient.name + ", ";
  }

  reqMsg += "food photography, ultra realistic"

  //console.log("THIS IS THE REQ MSG FOR THE IMG: \n" + reqMsg)

  const url = await fetch(BACKEND_URL + "/second", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reqMsg }),
  })
    .then((res) => res.json())
    .then((data) => {
      const imageUrl = data.image.data[0].url;
      //console.log("IMG URL: \n" + imageUrl + "\n\n\n");
      return imageUrl;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
  return url;
}


export async function getRecipeData(inputData) {
  var burntCalories = 0;
  const {
    age,
    weight,
    height,
    gender,
    activityLevel,
    breakfast,
    lunch,
    dinner,
    diet,
    likedIngredients,
    excludedIngredients,
  } = inputData;

  var totalCalories = 0;

  const bmr = calculateBMR(
    parseInt(weight),
    parseInt(height),
    parseInt(age),
    gender
  );
  const tdee = calculateTDEE(bmr, activityLevel);
  totalCalories = tdee + burntCalories;

  

  // var likes = likedIngredients
  //   .filter((item) => item.trim() !== "")
  //   .map((item) => item.trim().split(" ")[0]);
  // const restOfLikes = likedIngredients
  //   .filter((item) => item.trim() !== "")
  //   .map((item) => item.trim().split(" "));
  // //restOfLikes.shift();
  var dislikes = excludedIngredients.filter((item) => item.trim() !== "");

  // if (restOfLikes === null || restOfLikes.length === 0)
  // {
  //   likes = ingredientsList[Math.floor(Math.random() * ingredientsList.length)];
  // }
  // else
  // {
  //   likes = ingredientsList[Math.floor(Math.random() * ingredientsList.length)];
  //   //likes = restOfLikes[Math.floor(Math.random() * restOfLikes.length)];
  // }

  if(diet === "vegetarian")
  {
    dislikes = dislikes.concat(veggieList);
    dislikes = dislikes.concat(seafoodList);
    console.log("VEGGIE?!");
  }
  if(dislikes.includes("fish"))
  {
    dislikes = dislikes.concat(seafoodList);
  }
  if(diet === "pescetarian")
  {
    dislikes = dislikes.concat(veggieList);
  }
  if(diet === "vegan")
  {
    dislikes = dislikes.concat(veggieList);
    dislikes = dislikes.concat(veganList);
    dislikes = dislikes.concat(seafoodList);
  }
  if(dislikes.includes("meat"))
  {
    dislikes = dislikes.concat(veggieList);
  }



  console.log(dislikes);

  var likes = filterOutElements(likedIngredients, dislikes);

  var type;
  if (breakfast) type = "breakfast";
  if (lunch) type = "main course";
  if (dinner) type = "main course";

  var reqURL = `${BACKEND_URL}/spoonacular`;
  var reqURLID = `${BACKEND_URL}/spoonacularID`;
  var reqURLRandom = `${BACKEND_URL}/spoonacularRandom`;

  var recepies = [];

  if(likedIngredients.length === 0)
  {
    try {
      const response = await fetch(reqURLRandom, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({type, diet}),
      });
  
      const data = await response.json();

      //console.log(data);

      var ID = processRandomRecipe(data, dislikes);
      console.log("ID: " + ID);

      try {
        const responseByID = await fetch(reqURLID, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ID}),
        });
    
        const dataByID = await responseByID.json();
  
        //console.log(dataByID);

        recepies.push(processRecipeResponseSpoonacular(dataByID, totalCalories));
    
      } catch (error) {
        console.error("Error:", error);
      }
  
    } catch (error) {
      console.error("Error:", error);
    }
  }
  else
  {
    for(var i = 0; i < 20; i++)
    {
      try {
        const response = await fetch(reqURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ likedIngredients:likes}),
        });
    
        const data = await response.json();
    
        const ID = getRecipeID(data, dislikes);
        console.log(ID);
    
        try {
          const responseByID = await fetch(reqURLID, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ID}),
          });
      
          const dataByID = await responseByID.json();
    
          //console.log(dataByID);
          //if(checkDiet(dataByID, diet))
          if(true)
          {
            recepies.push(processRecipeResponseSpoonacular(dataByID, totalCalories));
            break;
          }
          else
          {
            console.log("SHIT");
          }
          
        } catch (error) {
          console.error("Error:", error);
        }
    
      } catch (error) {
        console.error("Error:", error);
      }
    }
    
  }


  return recepies;
}
