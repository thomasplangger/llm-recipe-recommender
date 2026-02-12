import { getRecipeData } from "./main.js";
import { getGPTRecipe } from "./main.js";
import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import https from "https";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

var privateKey, certificate, ca, credentials;

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.OA_API_KEY,
});

// EDAMAM
const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_API_KEY;

const openai = new OpenAIApi(configuration);


if (process.env.NODE_ENV === "production") {

  privateKey = fs.readFileSync("/etc/letsencrypt/live/davidrainer.dev/privkey.pem", "utf8");
  certificate = fs.readFileSync("/etc/letsencrypt/live/davidrainer.dev/cert.pem", "utf8");
  ca = fs.readFileSync("/etc/letsencrypt/live/davidrainer.dev/fullchain.pem", "utf8");

  credentials = { key: privateKey, cert: certificate, ca: ca };
}

const app = express();
const port = process.env.PORT;


var corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://study.davidrainer.dev',
    'https://study.davidrainer.dev',
    'http://davidrainer.dev',
    'https://davidrainer.dev',
  ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { messages, recepies } = req.body;

  //console.log(messages)
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    //model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          `As MealGPT, your health coach and meal plan assistant, I will provide you with valid JSON strings representing meal plans. Each meal will contain the following information: name, mealType, ingredients, calories, macros, instructions. Here's an example of the JSON object:
  {
    "name": "Oats with Milk and Banana",
    "mealType": "breakfast",
    "ingredients": [
      {
        "name": "Oats",
        "amount": 50,
        "unit": "grams"
      },
      {
        "name": "Milk",
        "amount": 200,
        "unit": "ml"
      },
      {
        "name": "Banana",
        "amount": 1,
        "unit": "piece"
      }
    ],
    "calories": 350,
    "macros": {
      "protein": 12,
      "carbs": 60,
      "fats": 6
    },
   "instructions": [
      "1. Mix oats and milk in a bowl.",
      "2. Slice the banana and add it to the mixture.",
      "3. Stir well and enjoy!"
    ]
  }
Please note that the provided JSON object is just an example, and you can customize the meal plans with different names, ingredients, and instructions according to your needs. The JSON object will contain an array of meal plans, each represented as a JSON object with the specified properties. It is mandatory that the provided JSON should be the only output because otherwise I can not parse it.

A JSON (JavaScript Object Notation) syntax is valid when it adheres to the following rules:

    Data Format: JSON must represent data in the form of key-value pairs or arrays of values.

    Keys: The keys must be strings enclosed in double quotes (e.g., "name": "John").

    Values: The values can be strings, numbers, booleans, null, objects (nested JSON), or arrays.

    Commas: Items in arrays or object properties must be separated by commas.

    Curly Braces: JSON objects are wrapped in curly braces {}.

    Square Brackets: JSON arrays are wrapped in square brackets [].

    Whitespace: JSON allows whitespace characters (spaces, tabs, line breaks) outside of strings. However, whitespace is not allowed within key names or unquoted strings.

Valid JSON example (an object with two properties, one of which contains an array):

{
  "name": "John",
  "age": 30,
  "hobbies": ["reading", "swimming", "cooking"]
}

Invalid JSON examples:

    Keys not enclosed in double quotes:
    {
  name: "John",
  "age": 30
}

Missing comma between properties:

{
  "name": "John"
  "age": 30
}

Extra comma after the last element in an array:

{
  "hobbies": ["reading", "swimming",]
}

Trailing comma after the last property:

{
  "name": "John",
  "age": 30,
}


If you don't have any meal plans with specific ingredient requirements generate random meal plans

`
      },
      ...messages,
    ],
  });

  res.json({
    completion: completion.data.choices[0].message,
  });
});

app.post("/architect", async (req, res) => {
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
  } = req.body;

  const inputData = {
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
  };
  console.log(req.body);
  try {
    const recipeData = await getGPTRecipe(inputData);
    const data = recipeData;
    //("recipe data", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
    console.log(error)
  }
});


app.post("/second", async (req, res) => {
  const { reqMsg } = req.body;

  let prompt = reqMsg;

  const result = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  res.json({
    image: result.data,
  });
});

app.post("/edamam", async (req, res) => {
  const { likes, dislikes, mealType } = req.body;

  const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${appKey}&q=${likes}&mealType=${mealType}&excluded=${dislikes}&random=true`;
  //const apiUrl = `https://api.edamam.com/search?q=${ingredient}&app_id=${appId}&app_key=${appKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

app.post("/standard", async (req, res) => {
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
  } = req.body;

  const inputData = {
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
  };

  

  var mType = "NIX OIDA";
  if (breakfast) mType = "Breakfast";
  if (lunch) mType = "Lunch";
  if (dinner) mType = "Dinner";

  console.log("TYPE:   " + mType);

  try {
    const recepieData = await getRecipeData(inputData);
    const data = recepieData;
    data[0].mealType = mType;
    console.log("DATA:   " + JSON.stringify(data));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
    console.log(error)
  }
});

app.post("/spoonacular", async (req, res) => {
  const { likedIngredients} = req.body;

  //const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=d7bb4a9a237442f8ad0f6d6d2f1830ac&query=${likes}&type=${mealType}&excludeIngredients=${dislikes}&addRecipeInformation=true&number=100&addRecipeNutrition=true`;
  const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=d7bb4a9a237442f8ad0f6d6d2f1830ac&ingredients=${likedIngredients}&number=100`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

app.post("/spoonacularID", async (req, res) => {
  const {ID} = req.body;
  
  const apiUrl = `https://api.spoonacular.com/recipes/${ID}/information?apiKey=d7bb4a9a237442f8ad0f6d6d2f1830ac&includeNutrition=true`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

app.post("/spoonacularRandom", async (req, res) => {
  const {type, diet} = req.body;
  
  const apiUrl = `https://api.spoonacular.com/recipes/random?apiKey=d7bb4a9a237442f8ad0f6d6d2f1830ac&number=100&tags=${type},${diet}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});


if (process.env.NODE_ENV === "production") {

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, () => {
    console.log(`Example app listening at ${process.env.PROD_URL}:${process.env.PORT}`);
  });

} else if (process.env.NODE_ENV === "development") {

  app.listen(port, () => {
    console.log(`Example app listening at ${process.env.DEV_URL}:${process.env.PORT}`);
  });
}
