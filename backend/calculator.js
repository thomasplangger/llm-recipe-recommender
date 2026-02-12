// Function to calculate Basal Metabolic Rate (BMR) based on gender, weight, height, and age
export function calculateBMR(weight, height, age, gender) {

  let gender_, weight_, height_, age_ = 0;

  if (!weight || !height || !age || !gender) {

    if (gender = 'male') {

      weight_ = 91;
      height_ = 178;
      age_ = 40;
      gender_ = gender
    } else if (gender === 'female') {
      weight_ = 72;
      height_ = 162;
      age_ = 40;
      gender_ = gender
    } else {
      weight_ = 91;
      height_ = 178;
      age_ = 40;
      gender_ = "male"
    }

  }
  else {
    weight_ = weight;
    age_ = age;
    height_ = height;
    gender_ = gender;
  }

  let bmr = 0;
  if (gender_ === 'male') {
    bmr = 66.47 + (13.75 * weight_) + (5.003 * height_) - (6.755 * age_);
  } else if (gender === 'female') {
    bmr = 655.1 + (9.563 * weight_) + (1.850 * height_) - (4.676 * age_);
  }

  return Math.round(bmr);
}

// Function to calculate Total Daily Energy Expenditure (TDEE) based on BMR and activity level
export function calculateTDEE(bmr, activityLevel) {
  let tdee = 0;
  switch (activityLevel) {
    case 'Extremely inactive':
      tdee = bmr * 1.2;
      break;
    case 'Sedentary':
      tdee = bmr * 1.375;
      break;
    case 'Moderately active':
      tdee = bmr * 1.55;
      break;
    case 'Vigorously active':
      tdee = bmr * 1.725;
      break;
    case 'Extremely active':
      tdee = bmr * 1.9;
      break;
    default:
      tdee = bmr;
  }
  return Math.round(tdee);
}

// Function to calculate macronutrient requirements based on total calorie intake
export function calculateMacronutrients(calories) {
  const protein = Math.round((calories * 0.25) / 4); // 0.8 grams of protein per kilogram
  const carbohydrates = Math.round((calories * 0.45) / 4); // 45% of calories from carbohydrates
  const fats = Math.round((calories * 0.30) / 9); // 35% of calories from fats

  return {
    protein,
    carbohydrates,
    fats
  };
}


export function findMostSimilarRecipe(responses, ingredients, dislikes) {
  //console.log(ingredients);

  //console.log("LENGTH[findMostSimilarRecipe]: " + responses.length);
  console.log("Ingredients: " + ingredients.length);
  if (ingredients.length === 0) {
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  let maxSimilarity = -1;
  let mostSimilarResponse = null;

  for (const response of responses) {
    const recipeIngredients = response.nutrition.ingredients;
    let similarity = 0;

    for (const recipeIngredient of recipeIngredients) {
      for (const ingredient of ingredients) {
        //console.log("[" + response.title + "]: " + ingredient + " : " + recipeIngredient.name)
        if (compareIgnredients(ingredient, recipeIngredient.name)) {
          //console.log("[" + response.title + "]: " + ingredient + " : " + recipeIngredient.name)
          console.log("[" + ingredient + " --- " + recipeIngredient.name +"]");
          similarity++;
          //break;
        }
      }
      for (const dislike of dislikes)
      {
        if(compareIgnredients(dislike, recipeIngredient.name))
        {
          similarity = -1000000;
          break;
        }
      }
    }

    console.log("[" + response.title + "] Number of similar ingredients: " + similarity );
    console.log("Ingredients:");
    for (const recipeIngredient of recipeIngredients)
    {
      console.log("- " + recipeIngredient.name);
    }
    
    //console.log(response);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarResponse = response;
    }
  }

  return mostSimilarResponse;
}

function compareIgnredients(ing1, ing2) {
  if (ing1.toLowerCase().includes(ing2) || ing2.toLowerCase().includes(ing1)) {
    return true;
  }

  return false;
}


export function scaleGPTMeals(totalKcal, recipe) {

  console.log("DEBUG", totalKcal, recipe, "END")

  var proteinScaled, carbsScaled, fatScaled, kcal;


  if(recipe.mealType == "breakfast" || recipe.mealType == "lunch")
  {
    kcal = Number(totalKcal) * 0.3;
  } 
  else
  {
    kcal = Number(totalKcal) * 0.4;
  }


  var factor = Number((Number(kcal) / Number(recipe.calories)).toFixed(1));

  recipe.ingredients = scaleIngredients(recipe.ingredients, factor);

  console.log("OIDA", recipe.macros.protein)
  console.log("OIDAFACTOR", factor)

  proteinScaled = Math.round(recipe.macros.protein * factor);
  carbsScaled = Math.round(recipe.macros.carbs * factor);
  fatScaled = Math.round(recipe.macros.fats * factor);

  console.log("OIDA2", proteinScaled)

  recipe.macros.protein = proteinScaled
  recipe.macros.carbs = carbsScaled
  recipe.macros.fats = fatScaled

  recipe.calories = recipe.macros.protein * 4 + recipe.macros.carbs * 4 + recipe.macros.fats * 9;

  console.log("CALCULATED", kcal, recipe, "END")

  return recipe
}

export function scaleIngredients(ingredients, factor) {
  return ingredients.map((ingredient) => {
    const scaledIngredient = { ...ingredient };
    scaledIngredient.amount =  Math.round(scaledIngredient.amount * factor);
    return scaledIngredient;
  });
}