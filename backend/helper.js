import exp from "constants";
import { findMostSimilarRecipe } from "./calculator.js";
import { ingredientsList } from "./lists.js";

const recipe = {
  name: '',
  mealType: '',
  mealDay: 0,
  ingredients: {
    name: '',
    amount: 0,
    unit: ''
  },
  calories: 0,
  macros: {
    protein: 0,
    carbs: 0,
    fats: 0
  },
  instructions: '',
  imgURL: ''
};




export function createRequestMessage(type, dislikes, likes, diet) {
    let message = `Create a recipe for one ${type}. `;
    
    if (dislikes.length > 0) {
      message += "The meal must exlude following ingredients: " + dislikes.join(", ") + ". \n";
    }
    
    if (likes.length > 0) {
      message += "The meal should include as many of the following ingredients as possible: " + likes.join(", ") + ". \n";
    }
    
    if(diet === "vegetarian")
    {
      message += "Make it vegetarian"
    }
    if(diet === "pescetarian")
    {
      message += "Make it pescetarian"
    }
    if(diet === "vegan")
    {
      message += "Make it vegan"
    }

    return message;
  }

  

export  function processRecipeString(recipeString) {
    const recipes = recipeString.split(/DAY\d+ (?:BREAKFAST|LUNCH|DINNER) /);
    const recipeList = [];
  
    for (let i = 1; i < recipes.length; i++) {
      const recipe = {
        name: '',
        mealType: '',
        mealDay: 0,
        ingredients: {
          name: '',
          amount: 0,
          unit: ''
        },
        calories: 0,
        macros: {
          protein: 0,
          carbs: 0,
          fats: 0
        },
        instructions: ''
      };
  
      const parts = recipes[i].split(/NAME:|INGREDIENTS:|CALORIES:|PROTEIN:|CARBS:|FATS:|INSTRUCTIONS:/);
  
      recipe.name = parts[1]?.trim() || '';
  
      // Splitting ingredients into an array of objects
      const ingredients = parts[2]?.trim() || '';
      const ingredientList = ingredients
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient !== ''); // Remove empty strings

      console.log(ingredientList);

      var out = parseIngredients(ingredientList)


      console.log(out);
      recipe.ingredients = out;

      // recipe.ingredients.amount = ing.amount;
      // recipe.ingredients.unit = ing.unit;
      // recipe.ingredients.name = ing.name;

      //recipe.ingredients = ingredientList.map(ingredient => parseIngredient(ingredient));

      // Handling ingredients separated by commas
      // if (ingredientList.length === 1 && ingredientList[0].includes(',')) {
      //   const commaSeparatedIngredients = ingredientList[0].split(',').map(ingredient => ingredient.trim());
      //   recipe.ingredients = commaSeparatedIngredients.map(ingredient => {
      //     const [line, amount, unit, ...nameParts] = ingredient.split(' ');
      //     const name = nameParts.join(' ');
      //     return {
      //       name,
      //       amount: parseFloat(amount),
      //       unit
      //     };
      //   });
      // } else {
      //   recipe.ingredients = ingredientList.map(ingredient => {
      //     const [line, amount, unit, ...nameParts] = ingredient.split(' ');
      //     const name = nameParts.join(' ');
      //     return {
      //       name,
      //       amount: parseFloat(amount),
      //       unit
      //     };
      //   });
      // }
  
      recipe.calories = parseFloat(parts[3]?.match(/\d+(?:\.\d+)?/)) || 0;
      recipe.macros.protein = parseFloat(parts[4]?.match(/[\d.]+/)) || 0;
      recipe.macros.carbs = parseFloat(parts[5]?.match(/[\d.]+/)) || 0;
      recipe.macros.fats = parseFloat(parts[6]?.match(/[\d.]+/)) || 0;
      
      // Splitting instructions into an array of strings
      const instructions = parts[7]?.trim() || '';
      recipe.instructions = instructions
        .split(/[\r\n]+/)
        .map(instruction => instruction.trim())
        .filter(instruction => instruction !== ''); // Remove empty strings
  
      const dayMealParts = recipes[i].match(/(BREAKFAST|LUNCH|DINNER) - DAY(\d+)/);
      if (dayMealParts) {
        recipe.mealType = dayMealParts[1];
        recipe.mealDay = parseInt(dayMealParts[2]);
      }
      recipe.mealDay = 3;
      recipe.mealType = "Dinner";
      //recipe.imgURL = "https://cdn.discordapp.com/attachments/1006733364373487647/1125471648523485246/unlucky42069_italien_style_pizza_with_basil_tomatos_on_a_vintag_889bc409-4fb1-4ee8-9a33-a619f35993c4.png"
  
      recipeList.push(recipe);
    }
  
    return recipeList;
  }

  // function parseIngredients(recipeArray) {
  //   const IngredientsList = []
  //   var amount, name, unit;
  
  //   recipeArray.forEach((ingredientString) => {
  //     const parts = ingredientString.split(' ');
  
  //     // Extract amount, unit, and ingredient name from the ingredientString
  //     const amountIndex = parts.findIndex(part => part.startsWith('A:'));
  //     const unitIndex = parts.findIndex(part => part.startsWith('U:'));
  //     const ingredientIndex = parts.findIndex(part => part.startsWith('I:'));
  
  //     amount = parseFloat(parts[amountIndex].substring(2));
  //     unit = parts[unitIndex].substring(2);
  //     //name = parts[ingredientIndex].substring(2);
  //     //name = parts[ingredientIndex].substring(2);
      
  //     name = parts.slice(ingredientIndex).map(part => part).join(' ');
  
  //     // Create the formatted ingredient string and add it to the ingredientsList
  //     IngredientsList.push({amount, unit, name})
  //     console.log(IngredientsList);
  //   });
    
  //   return IngredientsList;
  // }

  function parseIngredients(input) {
    return input.map(item => {
      const amountMatch = item.match(/A:(\d+)/); // Match digits after "A:"
      const unitMatch = item.match(/U:([^\s]+)/); // Match non-space characters after "U:"
      const nameMatch = item.match(/I:(.+)/); // Match anything after "I:"
      
      const amount = amountMatch ? parseInt(amountMatch[1]) : 0; // If no amount, default to 0
      const unit = unitMatch ? unitMatch[1] : 'g'; // If no unit, default to 'g'
      const name = nameMatch ? nameMatch[1] : ''; // If no name, default to empty string
  
      return { amount, unit, name };
    });
  }
  
//   function processRecipeResponse(response) {
//     const recipeData = response.hits[0].recipe; // Consider first hit
//     const recipeList = [];

//     const recipe = {
//         name: recipeData.label || '',
//         mealTyp: '', // This data is not directly available in the Edamam API response, may need another source or setting this value manually
//         mealDay: 0, // This data is not directly available in the Edamam API response, may need another source or setting this value manually
//         ingredients: recipeData.ingredientLines, // Join ingredient lines into a single string
//         calories: Math.round(recipeData.calories) || 0,
//         macros: {
//             protein: Math.round(recipeData.totalNutrients.PROCNT.quantity) || 0,
//             carbs: Math.round(recipeData.totalNutrients.CHOCDF.quantity) || 0,
//             fats: Math.round(recipeData.totalNutrients.FAT.quantity) || 0
//         },
//         instructions: recipeData.url, // Edamam API doesn't provide detailed cooking instructions, instead it gives the source URL
//         imgURL: recipeData.image
//     };
//     return recipe;
// }

export function filterOutElements(arrayToFilter, arrayToRemove) {
  var ret = arrayToFilter.filter(element => !arrayToRemove.includes(element));
  return ret;
}

export function processRandomRecipe(obj, dislikes)
{
  var data = obj.recipes;
  console.log("LENGTH: " + data.length);
  if(dislikes.length == 0)
  {
    const recipe = data[Math.floor(Math.random() * data.length)];
    return recipe.id;
  }
  // console.log("DISLIKES: " + dislikes);
  // console.log("Amount before filtering: " + data.length);
  var dataFiltered = data.filter(entry => {
    const hasDislikedIngredient = entry.extendedIngredients.some(ingredient => containsDislikedIngredient(ingredient.name, dislikes));
        return !hasDislikedIngredient;
  });

  console.log("Amount after filtering: " + dataFiltered.length);
  const recipe = dataFiltered[Math.floor(Math.random() * dataFiltered.length)];
  return recipe.id;
}

export function getRecipeID(data, dislikes)
{
  console.log("DISLIKES: " + dislikes);
  console.log("Amount before filtering: " + data.length);
  var dataFiltered = data.filter(entry => {
    const hasDislikedIngredient = entry.missedIngredients.some(ingredient => containsDislikedIngredient(ingredient.name, dislikes)) ||
                                      entry.usedIngredients.some(ingredient => containsDislikedIngredient(ingredient.name, dislikes));
        return !hasDislikedIngredient;
  });

  dataFiltered = dataFiltered.slice(0,10);
  console.log("Amount after filtering: " + dataFiltered.length);
  const recipe = data[Math.floor(Math.random() * data.length)];
  return recipe.id;
}

function containsDislikedIngredient(ingredientName, dislikes) {
  const lowerCaseIngredient = ingredientName.toLowerCase();
  var ret = dislikes.some(dislikedIngredient => lowerCaseIngredient.includes(dislikedIngredient.toLowerCase()));
  return ret;
}

export function checkDiet(recipe, diet)
{
  console.log(diet);
  console.log("VEGAN: " + recipe.vegan);
  if(diet == "vegan" && recipe.vegetarian == true)
  {
    return true;
  }
  if(diet == "vegetarian" && recipe.vegetarian == true)
  {
    return true;
  }
  if(diet === "pescetarian")
  {
    return true;
  }

  return false;
}

export function processRecipeResponseSpoonacular(response, kcal) {

  const recipeData = response;
  const recipe = {
      name: recipeData.title || '',
      mealTyp: '', // This data is not directly available in the Spoonacular API response, may need another source or setting this value manually
      mealDay: 0, // This data is not directly available in the Spoonacular API response, may need another source or setting this value manually
      ingredients: recipeData.nutrition.ingredients.map(ingr => ({
        name: ingr.name,
        amount: ingr.amount,
        unit: ingr.unit
      })), // Map the ingredients to an array of objects
      instructions: recipeData.analyzedInstructions[0].steps.length > 0? recipeData.analyzedInstructions[0].steps.map(step => step.step): null,     // Spoonacular API provides detailed cooking instructions
      calories: Math.round(recipeData.nutrition.nutrients[0].amount) || 0,
        macros: {
            protein: Math.round(recipeData.nutrition.nutrients[8].amount) || 0,
            carbs: Math.round(recipeData.nutrition.nutrients[3].amount) || 0,
            fats: Math.round(recipeData.nutrition.nutrients[1].amount) || 0
        },
      imgURL: recipeData.image
  };
  if(kcal == 0)
  {
    return recipe;
  }
  //return recipe;
  return adjustRecipeCalories(recipe, kcal);
}

function adjustRecipeCalories(recipe, targetKcal) {

  targetKcal = Number(targetKcal * 0.33).toFixed(0);

  const currentKcal = recipe.calories;
  const adjustmentFactor = Number((Number(targetKcal) / Number(currentKcal)).toFixed(1));

  console.log("Factor: " + adjustmentFactor);

  // Adjust ingredient amounts
  recipe.ingredients.forEach(ingredient => {
    ingredient.amount = (ingredient.amount * adjustmentFactor).toFixed(1);
  });

  // Adjust macros
  recipe.macros.protein = (recipe.macros.protein * adjustmentFactor).toFixed(0);
  recipe.macros.carbs = (recipe.macros.carbs * adjustmentFactor).toFixed(0);
  recipe.macros.fats = (recipe.macros.fats * adjustmentFactor).toFixed(0);

  // Update calories
  recipe.calories = recipe.macros.protein * 4 + recipe.macros.carbs * 4 + recipe.macros.fats * 9;

  return recipe;
}


  // //  Function to display recipes
  // function displayRecipes(recipes) {
  //   // Clear previous recipes
  //   console.log("displaying " + recipes.length);
  //   imageContainer.innerHTML = "";  

  //   // Loop through each recipe
  //   recipes.forEach((recipe, index) => {
  //     // Create recipe element
  //     const recipeElement = document.createElement('div');
  //     recipeElement.classList.add('recipe');

  //     // Recipe name
  //     const recipeNameElement = document.createElement('h2');
  //     recipeNameElement.classList.add('recipe-name');
  //     recipeNameElement.textContent = recipe.name;
  //     recipeElement.appendChild(recipeNameElement);

  //     // Line separator
  //     const lineSeparator = document.createElement('hr');
  //     recipeElement.appendChild(lineSeparator);

  //     // Meal and day information
  //     const mealDayElement = document.createElement('h3');
  //     mealDayElement.classList.add('meal-day');
  //     mealDayElement.textContent = `${recipe.mealTyp} - Day ${recipe.mealDay}`;
  //     recipeElement.appendChild(mealDayElement);

  //     // Recipe image
  //     const recipeImageElement = document.createElement('img');
  //     //recipeImageElement.src = recipe.imageUrl;
  //     recipeImageElement.src = recipe.imgURL;
  //     recipeImageElement.alt = recipe.name;
  //     recipeImageElement.style.maxWidth = '50%';
  //     recipeElement.appendChild(recipeImageElement);

  //     // Kcal and macro nutrients
  //     const nutrientInfoElement = document.createElement('p');
  //     nutrientInfoElement.textContent = `Calories: ${recipe.calories} kcal, Protein: ${recipe.macros.protein} g, Carbs: ${recipe.macros.carbs} g, Fats: ${recipe.macros.fats} g`;
  //     recipeElement.appendChild(nutrientInfoElement);

  //     // Ingredients
  //     const ingredientsHeadingElement = document.createElement('h4');
  //     ingredientsHeadingElement.textContent = 'Ingredients:';
  //     recipeElement.appendChild(ingredientsHeadingElement);

  //     const ingredientsListElement = document.createElement('ul');
  //     recipe.ingredients.forEach(ingredient => {
  //       const ingredientItemElement = document.createElement('li');
  //       ingredientItemElement.textContent = ingredient.amount + " " + ingredient.unit + " " + ingredient.name;
  //       ingredientsListElement.appendChild(ingredientItemElement);
  //     });
  //     recipeElement.appendChild(ingredientsListElement);

  //     // Recipe instructions
  //     const instructionsHeadingElement = document.createElement('h4');
  //     instructionsHeadingElement.textContent = 'Recipe:';
  //     recipeElement.appendChild(instructionsHeadingElement);

  //     const instructionsListElement = document.createElement('p');
  //     recipe.instructions.forEach(instruction => {
  //       const instructionsItemElement = document.createElement('li');
  //       instructionsItemElement.style.listStyleType = 'decimal';
  //       instructionsItemElement.textContent = instruction;
  //       instructionsListElement.appendChild(instructionsItemElement);
  //     });
  //     recipeElement.appendChild(instructionsListElement);

  //     // const instructionsElement = document.createElement('p');
  //     // instructionsElement.textContent = recipe.instructions;
  //     // recipeElement.appendChild(instructionsElement);

  //     // Append the recipe element to the image container
  //     imageContainer.appendChild(recipeElement);
  //   });
  // }

  

  // function displayRecipes(recipeList) {
  //   recipeList.forEach((recipe) => {
  //     const recipeContainer = document.createElement('div');
  //     recipeContainer.classList.add('recipe-container');
  
  //     // Name
  //     const nameElement = document.createElement('h2');
  //     nameElement.textContent = recipe.name;
  //     recipeContainer.appendChild(nameElement);
  
  //     // Ingredients
  //     const ingredientsElement = document.createElement('div');
  //     ingredientsElement.innerHTML = `<strong>Ingredients:</strong><br>${recipe.ingredients}`;
  //     recipeContainer.appendChild(ingredientsElement);
  
  //     // Calories
  //     const caloriesElement = document.createElement('p');
  //     caloriesElement.innerHTML = `<strong>Calories:</strong> ${recipe.calories}`;
  //     recipeContainer.appendChild(caloriesElement);
  
  //     // Macros
  //     const macrosElement = document.createElement('div');
  //     macrosElement.innerHTML = `<strong>Macros:</strong><br>Protein: ${recipe.macros.protein}g, Carbs: ${recipe.macros.carbs}g, Fats: ${recipe.macros.fats}g`;
  //     recipeContainer.appendChild(macrosElement);
  
  //     // Instructions
  //     const instructionsElement = document.createElement('div');
  //     instructionsElement.innerHTML = `<strong>Instructions:</strong><br>${recipe.instructions}`;
  //     recipeContainer.appendChild(instructionsElement);
  
  //     // Append the recipe container to the chat log
  //     chatLog.appendChild(recipeContainer);
  //     chatLog.scrollTop = chatLog.scrollHeight;
  //   });
  // }


  // function genImage(prompt)
  // {
  //   const prompt = 'steak with potatos'

  //   const url = result.data.data[0].url;
  //   console.log(url);
  //   const imageContainer = document.getElementById("image-container");

  //   // Create the image element
  //   const imageElement = document.createElement("img");
  //   imageElement.src = imageUrl;

  //   // Append the image element to the container
  //   imageContainer.appendChild(imageElement);
  // }

  // function imageGen(imageUrl)
  // {
  //   const imageContainer = document.getElementById("image-container");

  //   // Create the image element
  //   const imageElement = document.createElement("img");
  //   imageElement.src = imageUrl;

  //   // Append the image element to the container
  //   imageContainer.appendChild(imageElement);
  // }
  