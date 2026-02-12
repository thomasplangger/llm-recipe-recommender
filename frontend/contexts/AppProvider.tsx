import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export interface IContext {
  data: IData;
  setData: Dispatch<SetStateAction<IData>>;
}

export const AppContext = createContext<IContext>(null);

export interface IData {
  mode?: "architect" | "standard"; // Architect is chatgpt, standard is the recipe api
  age?: string;
  weight?: string;
  height?: string;
  gender?: "male" | "female" | "";
  activityLevel?:
  | "Extremely inactive"
  | "Sedentary"
  | "Moderately active"
  | "Vigorously active"
  | "Extremely active"
  | "";
  mealAmount?: "1" | "2" | "3" | "4";
  diet?: "vegetarian" | "vegan" | "pescetarian" | ""
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  likedIngredients?: string[];
  excludedIngredients?: string[];
  ratedMeals?: IMealRating[];
  surveyData?: {
    [key: string]: string;
  }[];
  date?: string;
  uuid?: string;
}

export const activityLevels: IData["activityLevel"][] = [
  "Extremely inactive",
  "Sedentary",
  "Moderately active",
  "Vigorously active",
  "Extremely active",
];

export const genders: IData["gender"][] = ["male", "female"];
export const mealAmounts: IData["mealAmount"][] = ["1", "2", "3", "4"];

const initialState: IData = {
  age: "",
  weight: "",
  height: "",
  gender: "",
  activityLevel: "",
  mealAmount: "1",
  breakfast: false,
  lunch: true,
  dinner: false,
  diet: "",
  likedIngredients: [],
  excludedIngredients: [],
  ratedMeals: [],
  surveyData: [],
  date: "",
  uuid: "",
};

export interface IMealRating {
  mode?: IData["mode"]
  diet?: IData["diet"]
  rating?: {
    picture?: number;
    ingredients?: number;
    wouldEat?: number;
    satisfaction?: number;
    presentation?: number;
  };
  mealName: string;
  userInput?: {
    mealAmount?: "1" | "2" | "3" | "4";
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
    likedIngredients?: string[];
    excludedIngredients?: string[];
  };
  createdMealData?: {
    [key: string]: any;
  };
}

export const initialMealRating: IMealRating = {
  rating: {
    picture: 0,
    ingredients: 0,
    wouldEat: 0,
    satisfaction: 0,
    presentation: 0,
  },
  mealName: "",
  diet: "",
  userInput: {},
  createdMealData: {},
};

export function AppProvider(props) {
  const [data, setData] = useState<IData>(initialState);

  useEffect(() => {
    //set random chatgpt or api
    const mode: IData["mode"] = Math.random() < 0.5 ? "architect" : "standard";
    setData((prev) => {
      return { ...prev, mode: mode };
    });
  }, []);

  return (
    <AppContext.Provider value={{ data, setData }}>
      {props.children}
    </AppContext.Provider>
  );
}
