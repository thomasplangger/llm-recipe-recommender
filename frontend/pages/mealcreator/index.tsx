import React, { useRef } from "react";
import Button from "@mui/material/Button";
import {
  AppContext,
  IContext,
  IData,
  IMealRating,
  activityLevels,
  genders,
  initialMealRating,
} from "contexts/AppProvider";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { Grid, Text, Wrapper } from "components/ui";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import styles from "./Mealcreator.module.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import { ingredientsList } from "utils/lists";
import FormLabel from "@mui/material/FormLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LikeDislike from "assets/svg/like_dislike.svg";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import Link from "next/link";
import supabase from "utils/supabaseConfig";



function isNumber(value?: string | number): boolean {
  return value != null && value !== "" && !isNaN(Number(value.toString()));
}

function isValidInput(value?: string | number): boolean {
  return !(!isNumber(value) && value !== "");
}

const BiometricData = (props: {
  setPageState: Dispatch<SetStateAction<number>>;
}) => {
  const { setPageState } = props;

  let { data, setData } = useContext<IContext>(AppContext);
  const [error, setError] = useState<boolean>(false);

  const onClickSkip = () => {
    setPageState(1);
    setError(false);
    setData((prev) => {
      return {
        ...prev,
        age: null,
        weight: null,
        height: null,
        gender: null,
        activityLevel: null,
      };
    });
  };

  const onClickContinue = () => {
    if (
      !(
        isValidInput(data.age) &&
        isValidInput(data.height) &&
        isValidInput(data.weight) &&
        data.gender !== "" &&
        data.activityLevel !== ""
      )
    ) {
      setError(true);
    } else {
      setError(false);
      setPageState(1);
    }
  };

  return (
    <div>
      <Wrapper className="pb-80 pt-160">
        <Grid>
          <Text as="h2" className="text-center col-span-full mb-16" color="black" variant="headlineSmall">TU Graz - Food Recommender - Study</Text>
          <Text as="p" className="col-span-full mb-32" color="black" variant="body">
            <strong>
              Thank you for your interest and your time!
            </strong>
            <br />

            As part of our Bachelor&apos;s thesis in the field of Software Engineering and Management at TU Graz, we are working on Food Recommender Systems. Your support is of great importance for this research work.<br /><br />

            This survey will take approximately 5 to 10 minutes.<br />

            Your data will be recorded as part of the study, but stored in an anonymized manner and treated with strict confidentiality according to the data protection regulations. By giving your consent, you agree to a scientific evaluation of the anonymized data and the publication of the study results.<br /><br />

            Please note that your participation is voluntary, and you can withdraw your consent to participate at any time without providing any reasons. This will not result in any disadvantages for you, and you have the right to request the deletion of your data.

            By clicking the &quot;Create Personalized Meals&quot; or the &quot;Skip This Step&quot; button, you voluntarily agree to participate in this survey. Once again, thank you for your valuable support!
            <br />
            <br />
            <strong>Contact:</strong>
            <br />
            <strong>
              plangger@student.tugraz
            </strong>
            <br />
            <strong>
              david.rainer@student.tugraz
            </strong>
          </Text>
          <div className="col-span-6 relative aspect-[500/500] hidden md:block overflow-hidden rounded-b-[2rem] rounded-tr-[2rem]">
            <Image
              src="/assets/vegetables_heart.png"
              alt="vegetable_heart"
              fill
              className="-z-10"
            />
          </div>
          <div className="md:col-span-5 col-span-full flex flex-col">
            <Text variant="headline" color="black">
              Personalize Your Journey
            </Text>
            <Text variant="headlineSmall" color="black" className="mb-16">
              Enter Your Details:
            </Text>
            <form className="flex flex-col gap-y-16 md:max-w-[33.3rem]">
              <TextField
                className={styles.Input}
                id="age"
                label="Age"
                variant="outlined"
                helperText={
                  !isValidInput(data.age) ? "Invalid Input: Numbers only." : ""
                }
                value={data.age || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      age: e.target.value as IData["age"],
                    };
                  });
                }}
                error={!isValidInput(data.age)}
                required
              />
              <TextField
                id="weight"
                label="Weight"
                variant="outlined"
                className={styles.Input}
                helperText={
                  !isValidInput(data.weight)
                    ? "Invalid Input: Numbers only."
                    : ""
                }
                value={data.weight || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      weight: e.target.value as IData["weight"],
                    };
                  });
                }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                error={!isValidInput(data.weight)}
              />
              <TextField
                id="height"
                label="Height"
                variant="outlined"
                required
                className={styles.Input}
                helperText={
                  !isValidInput(data.height)
                    ? "Invalid Input: Numbers only."
                    : ""
                }
                value={data.height || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      height: e.target.value as IData["height"],
                    };
                  });
                }}
                error={!isValidInput(data.height)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth>
                <InputLabel id="label_gender">Gender</InputLabel>
                <Select
                  required
                  labelId="label_gender"
                  id="gender"
                  value={data.gender}
                  label="Gender"
                  className={styles.Input}
                  defaultValue={""}
                  onChange={(e: SelectChangeEvent) =>
                    setData((prev) => {
                      return {
                        ...prev,
                        gender: e.target.value as IData["gender"],
                      };
                    })
                  }
                >
                  {genders.map((activity) => {
                    return (
                      <MenuItem key={activity} value={activity}>
                        {activity}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="label_activityLevel">Activity Level</InputLabel>
                <Select
                  required
                  labelId="label_activityLevel"
                  id="activityLevel"
                  value={data.activityLevel}
                  label="Activity Level"
                  defaultValue={""}
                  className={styles.Input}
                  onChange={(e: SelectChangeEvent) =>
                    setData((prev) => {
                      return {
                        ...prev,
                        activityLevel: e.target.value as IData["activityLevel"],
                      };
                    })
                  }
                >
                  {activityLevels.map((activity) => {
                    return (
                      <MenuItem key={activity} value={activity}>
                        {activity}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {error && (
                <Text variant="body" color="error">
                  Please ensure all fields are filled out before submitting the
                  form. However you can also choose to skip this step.
                </Text>
              )}
              <Button
                color="primary"
                variant="contained"
                className="text-[1.4rem]"
                onClick={onClickContinue}
              >
                Create Personalized Meals
              </Button>
              <Button
                color="primary"
                variant="outlined"
                className="text-[1.4rem]"
                onClick={onClickSkip}
              >
                Skip this Step
              </Button>
            </form>
          </div>
        </Grid>
      </Wrapper>
    </div>
  );
};

interface IMeal {
  name: string;
  mealType: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  calories: string;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  instructions: string[];
  imgURL: string;
}

const MealCreationPage = (props: {
  setPageState: Dispatch<SetStateAction<number>>;
}) => {
  const { setPageState } = props;

  const jumpRef = useRef<HTMLHRElement>(null);

  let { data, setData } = useContext<IContext>(AppContext);
  const [error, setError] = useState<boolean>(false);
  const [mealData, setMealData] = useState<IMeal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);
  const [requestCounter, setRequestCounter] = useState<number>(0);
  const [nextPageError, setNextPageError] = useState<boolean>(false)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      breakfast: false,
      lunch: false,
      dinner: false,
      [e.target.name]: e.target.checked,
    });
  };

  const handleDietCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      diet: data.diet === e.target.name ? "" : e.target.name as IData["diet"],
    });
  };

  const { breakfast, lunch, dinner } = data;
  const checkboxError =
    [breakfast, lunch, dinner].filter((v) => v).length === 0;


  const onClickToSurvey = () => {

    if (!data.ratedMeals.length) {
      setNextPageError(true)
      return
    }

    setNextPageError(false);
    setPageState(2)

  }


  const onClickCreateMeal = () => {
    if (checkboxError) {
      setError(true);
    } else {
      if (requestCounter > 15) return; // only allow 3 requests max
      if (jumpRef.current)
        jumpRef.current.scrollIntoView({ behavior: "smooth" });
      setLoading(true);
      setMealData([]);
      setNoDataFound(false);
      setRequestCounter((prev) => prev + 1);
      //request to LLM or API
      const backendPath = data.mode;
      const env = process.env.NODE_ENV
      var address;
      if (env == "development") {
        address = `http://localhost:4000/${backendPath}`
      }
      else if (env == "production") {
        address = `https://study.davidrainer.dev:4000/${backendPath}`
      }
      else {
        address = `http://localhost:4000/${backendPath}`
      }

      fetch(address, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.length === 0) {
            setNoDataFound(true);
          }
          setMealData(data);
          setLoading(false);
          // console.log('response', data);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
          setNoDataFound(true);
        });

      setError(false);
    }
  };

  const onClickCreateMealHandler = () => {

    if (data.mode === 'architect')
      onClickCreateMealGPT();
    if (data.mode === 'standard')
      onClickCreateMeal()

  }

  const onClickCreateMealGPT = () => {
    const maxRetries = 3;
    let retries = 0;

    const makeRequest = () => {
      if (checkboxError) {
        setError(true);
        return;
      }

      if (requestCounter > maxRetries) {
        return;
      }

      if (jumpRef.current) {
        jumpRef.current.scrollIntoView({ behavior: "smooth" });
      }

      setLoading(true);
      setMealData([]);
      setNoDataFound(false);
      setRequestCounter((prev) => prev + 1);

      //request to LLM or API
      const backendPath = data.mode;
      const env = process.env.NODE_ENV;
      const address =
        env === "development"
          ? `http://localhost:4000/${backendPath}`
          : `https://study.davidrainer.dev:4000/${backendPath}`;

      fetch(address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.length === 0) {
            setNoDataFound(true);
          }
          setMealData(data);
          setLoading(false);
          // console.log("response", data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
          setNoDataFound(true);
          if (retries < maxRetries) {
            retries++;
            // console.log(`Retrying request (${retries}/${maxRetries})...`);
            makeRequest(); // Retry the request
          }
        });

      setError(false);
    };

    makeRequest();
  };

  return (
    <div>
      <Wrapper className="pb-80 pt-160">
        <Grid>
          <Text as="p" className="col-span-full mb-32" variant="body" color="black">
            <strong>
              Create Your Perfect Meal!
            </strong>
            <br />

            Welcome to our personalized culinary experience! Choose your meal type (Breakfast, Lunch, Dinner), portion size, favorite ingredients, and any ingredients to avoid.
            <br />
            <br />
            To help us improve the provided food recommendations, kindly <strong>rate at least one of the meals </strong> from your customized options before proceeding with the survey. Your feedback is valuable and will ensure that we continue to provide exceptional dining experiences tailored to your liking.</Text>
          <div className="col-span-6 relative aspect-[500/500] hidden md:block overflow-hidden rounded-b-[2rem] rounded-tr-[2rem]">
            <Image
              src='/assets/recipe.png'
              alt="recipe"
              fill
              className="-z-10"
            />
          </div>
          <div className="md:col-span-5 col-span-full flex flex-col">
            <Text variant="headline" color="black">
              Customize Your Meal!
            </Text>
            <Text variant="body" color="black" className="mb-16">
              Create a personalized culinary experience tailored to your taste
              buds! Select your meal type, portion size, favorite ingredients,
              and any ingredients to avoid.
            </Text>
            <form className="flex flex-col gap-y-16 md:max-w-[33.3rem]">
              <div className="flex flex-col gap-y-8">
                <Text variant="bodyBold" color="black">
                  Choose Your Meal Type:
                </Text>
                <FormControl required error={checkboxError}>
                  <FormLabel component="legend">Pick only one</FormLabel>
                  <FormGroup className="flex gap-x-16">
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Breakfast"
                      value="breakfast"
                      name="breakfast"
                      onChange={handleCheckboxChange}
                      checked={data.breakfast}
                    />
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Lunch"
                      value="lunch"
                      name="lunch"
                      onChange={handleCheckboxChange}
                      checked={data.lunch}
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Dinner"
                      value="dinner"
                      name="dinner"
                      onChange={handleCheckboxChange}
                      checked={data.dinner}
                    />
                  </FormGroup>
                </FormControl>
              </div>
              <div className="flex flex-col gap-y-8">
                <Text variant="bodyBold" color="black">
                  Choose Your Diet:
                </Text>
                <FormControl >
                  <FormGroup className="flex gap-x-16">
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Pescetarian"
                      value="pescetarian"
                      name="pescetarian"
                      onChange={handleDietCheckboxChange}
                      checked={data.diet === "pescetarian"}
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Vegetarian"
                      value="vegetarian"
                      name="vegetarian"
                      onChange={handleDietCheckboxChange}
                      checked={data.diet === "vegetarian"}
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Vegan"
                      value="vegan"
                      name="vegan"
                      onChange={handleDietCheckboxChange}
                      checked={data.diet === "vegan"}
                    />
                  </FormGroup>
                </FormControl>
              </div>
              <div className="flex flex-col gap-y-16">
                {/* <Text variant="bodyBold" color="black">
                  Select Your Number Of Meals Per Type :
                </Text>
                <FormControl fullWidth>
                  <InputLabel id="label_activityLevel">
                    Amount of Meals
                  </InputLabel>
                  <Select
                    required
                    labelId="label_mealAmount"
                    id="mealAmount"
                    value={data.mealAmount}
                    label="Amount of Meals"
                    defaultValue={"1"}
                    className={styles.Input}
                    onChange={(e: SelectChangeEvent) =>
                      setData((prev) => {
                        return {
                          ...prev,
                          mealAmount: e.target.value as IData["mealAmount"],
                        };
                      })
                    }
                  >
                    {mealAmounts.map((activity) => {
                      return (
                        <MenuItem key={activity} value={activity}>
                          {activity}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl> */}
                <div className="flex flex-col gap-y-16">
                  <Text variant="bodyBold" color="black">
                    Select Your Favorite Ingredients :
                  </Text>
                  <Autocomplete
                    multiple
                    id="liked_ingredients"
                    options={ingredientsList}
                    getOptionLabel={(option) => option}
                    onChange={(e, values) =>
                      setData((prev) => {
                        return { ...prev, likedIngredients: values };
                      })
                    }
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="I like..."
                          placeholder="Favorite Ingredients"
                        />
                      );
                    }}
                  />
                </div>
                <div className="flex flex-col gap-y-16">
                  <Text variant="bodyBold" color="black">
                    Exclude Any Ingredients:
                  </Text>
                  <Autocomplete
                    multiple
                    id="dont_like_ingredients"
                    options={ingredientsList}
                    getOptionLabel={(option) => option}
                    onChange={(e, values) =>
                      setData((prev) => {
                        return { ...prev, excludedIngredients: values };
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="I don't want..."
                        placeholder="Excluded Ingredients"
                      />
                    )}
                  />
                </div>
              </div>
              {error && (
                <Text variant="body" color="error">
                  Please select at least one type of meal.
                </Text>
              )}
              {requestCounter > 15 && (
                <Text variant="body" color="error">
                  You reached the maximum amount of requests
                </Text>
              )}
              <Button
                color="primary"
                variant="contained"
                className="text-[1.4rem]"
                onClick={onClickCreateMealHandler}
                disabled={loading}
              >
                {loading ? "Creating meals..." : "Generate Meals"}
              </Button>
            </form>
          </div>
          <hr className="col-span-full my-64 border-grey-dark" ref={jumpRef} />
          {
            !!mealData.length &&
            mealData.map((meal) => {
              const {
                mealType,
                name,
                ingredients,
                macros,
                instructions,
                imgURL,
                calories,
              } = meal;

              return (
                <MealInfoCard
                  key={name}
                  type={mealType}
                  title={name}
                  ingredients={ingredients}
                  recipe={instructions}
                  calories={calories}
                  macros={macros}
                  url={imgURL}
                  className="mb-64"
                />
              );
            })}
          {loading && <LoadingCard />}
          {noDataFound && (
            <Text
              variant="body"
              color="error"
              className="col-span-full text-center"
            >
              No Recipe Found
            </Text>
          )}
          {/* <MealInfoCard
            type={"breakfast"}
            title={"Burger"}
            ingredients={[{ name: "1", amount: 1, unit: "1" }]}
            recipe={["1"]}
            nutrients={{
              calories: "1",
              macros: { protein: 1, fats: 1, carbs: 1 },
            }}
            url={null}
          /> */}
        </Grid>
        <hr className="col-span-full my-64 mb-16 border-grey-dark" />
        {requestCounter > 0 && (
          <>
            <Text as="h2" variant="headline" color="black" className="col-span-full">
              Survey
            </Text>
            <Text as="p" variant="body" color="black">
              Don&apos;t miss our survey! Share your thoughts.
            </Text>
            {nextPageError && (
              <Text as="p" variant="body" color="error">
                Oops! It seems you haven&apos;t completed the survey properly.
                To ensure accurate data collection, we kindly ask you to rate
                at least one meal before proceeding.
              </Text>
            )}
            <div className="col-span-full flex flex-col items-center">
              <Button
                color="primary"
                variant="contained"
                className="text-[1.4rem] mt-32 md:ml-auto"
                onClick={onClickToSurvey}
              >
                Go to survey
              </Button>
            </div>
          </>
        )}
      </Wrapper>
    </div>
  );
};

interface IMealInfoCard {
  type?: string;
  title?: string;
  ingredients?: {
    name: string;
    amount: number;
    unit: string;
  }[];
  recipe?: string[];
  calories?: string;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  url?: string;
  className?: string;
}

interface ILocalSurveyData {
  hasFinished: boolean;
}

const LoadingCard = () => {
  return (
    <>
      <Text
        as="p"
        variant="bodyBold"
        color="black"
        className="mb-32 col-span-full text-center"
      >
        Due to a high volume of server requests, you may experience longer
        waiting times
      </Text>
      <div
        className={`${styles.Shine} relative md:col-start-2 md:col-span-10 col-span-full flex md:flex-row flex-col gap-x-[2rem]`}
      >
        <div className="md:w-1/2 w-full md:max-w-[400px] md:max-h-[400px] mb-16 md:mb-0 min-w-[300px] min-h-[300px] md:md:min-h-[40rem] bg-grey-light h-full relative aspect-1 overflow-hidden rounded-b-[2rem] rounded-tr-[2rem]"></div>
        <div className="md:w-1/2 w-full flex flex-col gap-y-16">
          <div className="w-full h-[6.4rem] bg-grey-light mb-8 rounded-[1.6rem]" />
          <div className="w-full h-[6.4rem] bg-grey-light mb-8 rounded-[1.6rem]" />
          <div className="w-full h-[6.4rem] bg-grey-light mb-8 rounded-[1.6rem]" />
          <div className="w-1/2 h-[4rem] bg-grey-light mb-8 rounded-[1.6rem]" />
        </div>
      </div>
    </>
  );
};

const MealInfoCard = (props: IMealInfoCard) => {
  const {
    type = "",
    title = "",
    ingredients = null,
    recipe = [],
    calories = "",
    macros = null,
    url = "",
    className = "",
  } = props;
  let { data, setData } = useContext<IContext>(AppContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rating, setRating] = useState<IMealRating>(initialMealRating);

  useEffect(() => {
    setRating((prev) => {
      const userInput: IMealRating["userInput"] = {
        mealAmount: data.mealAmount,
        breakfast: data.breakfast,
        lunch: data.lunch,
        dinner: data.dinner,
        likedIngredients: data.likedIngredients,
        excludedIngredients: data.excludedIngredients,
      };
      const createdMealData: IMealRating["createdMealData"] = {
        type,
        ingredients,
        recipe,
        calories,
        macros,
        url,
      };
      return {
        ...prev,
        mealName: title,
        userInput: userInput,
        createdMealData: createdMealData,
        mode: data.mode,
        diet: data.diet
      };
    });
  }, []);

  const onSubmit = () => {
    setData((prev) => {
      return { ...prev, ratedMeals: [...prev.ratedMeals, rating] };
    });
    //send to database
    const saveData = async () => {
      const { error } = await supabase
        .from('ratedmeals')
        .insert({ data: rating })
    }
    saveData()
    //

    handleClose();
  };

  const mealRated =
    data.ratedMeals &&
    data.ratedMeals.filter((meal) => meal.mealName === title).length > 0;

  return (
    <div
      className={`${className} md:col-start-2 md:col-span-10 col-span-full flex md:flex-row flex-col gap-x-[2rem]`}
    >
      <div className="md:w-1/2 w-full md:max-w-[400px] md:max-h-[400px] mb-16 md:mb-0 min-w-[300px] min-h-[300px] md:md:min-h-[40rem] h-full relative aspect-1 overflow-hidden rounded-b-[2rem] rounded-tr-[2rem]">
        {url && (
          <Image
            src={url}
            alt={title}
            fill
            className="-z-10"
          />
        )}
      </div>
      <div className="md:w-1/2 w-full flex flex-col gap-y-16">
        {type && (
          <Text color="black" variant="eyebrow" className="uppercase">
            {type}
          </Text>
        )}
        {title && (
          <Text color="black" variant="headlineSmall">
            {title}
          </Text>
        )}

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Text variant="headlineSmall" color="black">
              Ingredients
            </Text>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-y-16">
              {ingredients &&
                ingredients.map((ingredient) => {
                  return (
                    <Text
                      key={JSON.stringify(ingredient)}
                      variant="body"
                      color="black"
                    >
                      {ingredient.name +
                        " " +
                        ingredient.amount +
                        " " +
                        ingredient.unit}
                    </Text>
                  );
                })}
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Text variant="headlineSmall" color="black">
              Recipe
            </Text>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col">
              {recipe &&
                recipe.map((rec) => (
                  <Text
                    key={rec}
                    className="border-b border-grey-light pb-8 mb-8"
                    variant="body"
                    color="black"
                  >
                    {rec}
                  </Text>
                ))}
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Text variant="headlineSmall" color="black">
              Nutritional Values
            </Text>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col">
              {calories &&
                <Text variant="headlineSmall" color="black">
                  {calories + " " + "Calories"}
                </Text>
              }
              <hr className="border-grey-dark my-16" />

              {macros && macros.fats && <>
                <div className="mb-8">
                  <Text variant="bodyBold" color="black">
                    {"Total Fat: "}
                  </Text>
                  <Text variant="body" color="black">
                    {macros.fats + "g"}
                  </Text>
                </div>
              </>
              }
              {macros && macros.carbs && <>
                <div className="mb-8">
                  <Text variant="bodyBold" color="black">
                    {"Total Carbohydrates: "}
                  </Text>
                  <Text variant="body" color="black">
                    {macros.carbs + "g"}
                  </Text>
                </div>
              </>}
              {macros && macros.protein && <>
                <div className="mb-8">
                  <Text variant="bodyBold" color="black">
                    {"Total Protein: "}
                  </Text>
                  <Text variant="body" color="black">
                    {macros.protein + "g"}
                  </Text>
                </div>
              </>}
            </div>
          </AccordionDetails>
        </Accordion>
        <Button
          color="primary"
          variant="contained"
          className="text-[1.4rem] w-1/2"
          endIcon={<LikeDislike className={styles.Icon} />}
          onClick={handleOpen}
          disabled={mealRated}
        >
          {mealRated ? "Thanks" : "Rate Meal"}
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="rate-modal"
        aria-describedby="rate-modal-description"
        className={styles.ModalDialog}
      >
        <div className={styles.Modal}>
          <Text
            className="mb-8"
            color="black"
            variant="headlineSmall"
          >{`Rating - ${title}`}</Text>
          <hr className="border-grey-dark my-16" />
          <div className="flex flex-col mb-16">
            <Text className="mb-8" color="black" variant="body">
              Picture: Rate the visual appeal of the meal based on the provided
              picture.
            </Text>
            <Rating
              name="picture"
              value={rating?.rating.picture}
              onChange={(_, newValue) => {
                setRating((prev) => {
                  return {
                    ...prev,
                    rating: { ...prev.rating, picture: newValue },
                  };
                });
              }}
              size="large"
            />
          </div>
          <div className="flex flex-col mb-16">
            <Text className="mb-8" color="black" variant="body">
              Ingredients: Rate the quality and appropriateness of the
              ingredients used in the meal.
            </Text>
            <Rating
              name="ingredients"
              value={rating?.rating.ingredients}
              onChange={(_, newValue) => {
                setRating((prev) => {
                  return {
                    ...prev,
                    rating: { ...prev.rating, ingredients: newValue },
                  };
                });
              }}
              size="large"
            />
          </div>
          <div className="flex flex-col mb-16">
            <Text className="mb-8" color="black" variant="body">
              Would Eat: Rate whether you would choose to eat this meal at all.
            </Text>
            <Rating
              name="wouldEat"
              value={rating?.rating.wouldEat}
              onChange={(_, newValue) => {
                setRating((prev) => {
                  return {
                    ...prev,
                    rating: { ...prev.rating, wouldEat: newValue },
                  };
                });
              }}
              size="large"
            />
          </div>
          <div className="flex flex-col mb-16">
            <Text className="mb-8" color="black" variant="body">
              Satisfaction: Rate your overall satisfaction with the meal.
            </Text>
            <Rating
              name="satisfaction"
              value={rating?.rating.satisfaction}
              onChange={(_, newValue) => {
                setRating((prev) => {
                  return {
                    ...prev,
                    rating: { ...prev.rating, satisfaction: newValue },
                  };
                });
              }}
              size="large"
            />
          </div>
          {/* <div className="flex flex-col mb-16">
            <Text className="mb-8" color="black" variant="body">
              Presentation: Rate the visual presentation of the meal, excluding
              the provided picture.
            </Text>
            <Rating
              name="presentation"
              value={rating?.rating.presentation}
              onChange={(_, newValue) => {
                setRating((prev) => {
                  return {
                    ...prev,
                    rating: { ...prev.rating, presentation: newValue },
                  };
                });
              }}
              size="large"
            />
          </div> */}

          <Button
            color="primary"
            variant="contained"
            className="text-[1.4rem] mt-32"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const SurveyPage = (props: {
  setPageState: Dispatch<SetStateAction<number>>;
}) => {
  let { data, setData } = useContext<IContext>(AppContext);
  const { setPageState } = props;

  const surveyJson = {
    elements: [
      {
        name: "RatingDesign",
        title:
          "How would you rate the overall design of the website for creating meals based on your preferences and ingredients?",
        type: "rating",
        rateType: "stars",
        displayMode: "buttons",
        isRequired: true,
      },
      {
        name: "VisuallyAppealing",
        title:
          "Did you find the website's interface visually appealing and easy to understand?",
        type: "rating",
        rateType: "stars",
        displayMode: "buttons",
        isRequired: true,
      },
      {
        name: "EasyToNavigate",
        title:
          "Did you find the process of creating a meal based on your ingredients easy to navigate?",
        type: "rating",
        rateType: "stars",
        displayMode: "buttons",
        isRequired: true,
      },
      {
        name: "IncorporateMeals",
        title:
          "How likely are you to incorporate the suggested meals into your regular eating habits?",
        type: "rating",
        rateType: "stars",
        displayMode: "buttons",
        isRequired: true,
      },
      {
        name: "MatchPreferences",
        title:
          "How well did the suggested meals match your taste preferences and ingredient choices?",
        type: "rating",
        rateType: "stars",
        displayMode: "buttons",
        isRequired: true,
      },
      {
        name: "Satisfaction",
        title:
          "How satisfied were you with the overall user experience of the website for creating meals based on your preferences and ingredients?",
        type: "rating",
        rateType: "stars",
        displayMode: "buttons",
        isRequired: true,
      },
      {
        name: "LikedProcess",
        title:
          "Is there anything specific you liked about the meal creation process or the suggested meals?",
        type: "comment",
        isRequired: false,
      },
      {
        name: "Improvements",
        title:
          "Is there anything you think could be improved to enhance the user experience or the quality of the meal suggestions?",
        type: "comment",
        isRequired: false,
      },
      {
        name: "UsefulFeatures",
        title:
          "Were there any specific features or functionalities that you found particularly useful or enjoyable?",
        type: "comment",
        isRequired: false,
      },
      {
        name: "RecommendationLikelihood",
        title:
          "Would you recommend this website to others who are looking to create meals based on their preferences and ingredients?",
        type: "rating",
        rateType: "stars",
        displayMode: "buttons",
        isRequired: true,
      },
      {
        name: "ContinueUsageLikelihood",
        title:
          "How likely are you to continue using the website to create meals in the future?",
        type: "rating",
        rateType: "stars",
        displayMode: "buttons",
        isRequired: true,
      },
      // {
      //   name: "Email",
      //   title:
      //     "Please provide your email address.",
      //   type: "text",
      //   isRequired: false,
      //   validators: [
      //     { "type": "email" }
      //   ]
      // },
      {
        type: "Checkbox",
        name: "TermsAndConditions",
        title: "Data Storage and Analysis AgreementTerms and Conditions",
        description:
          "By proceeding with the use of our services, you agree that your data will be securely saved and stored in our database. This data will be used for the sole purpose of further analysis and improvement of our services. Rest assured, your information will be treated with the utmost confidentiality and will not be shared with any third parties without your explicit consent. Your trust in our commitment to data privacy is our top priority.",
        choices: ["I Agree"],
        isRequired: true,
      },
    ],
  };

  const survey = new Model(surveyJson);
  survey.onComplete.add(
    useCallback((sur) => {
      //create survey ID
      const uuid = crypto.randomUUID();
      //add date to survey
      const currentDate = new Date();
      //save data
      setData((prev) => {
        return {
          ...prev,
          surveyData: sur.data,
          date: currentDate.toISOString(),
          uuid: uuid,
        };
      });
    }, [])
  );

  useEffect(() => {
    if (data.uuid) {
      // console.log(data); //all the data
      //send to database
      const saveData = async () => {
        const { error } = await supabase
          .from('surveydata')
          .insert({ data })
      }
      saveData()

      // prohibit user from taking the survey twice
      const surveyData: ILocalSurveyData = {
        hasFinished: true,
      };
      localStorage.setItem("surveyData", JSON.stringify(surveyData));

      setPageState(3);
    }
  }, [data]);

  return (
    <div className="pb-80 pt-160">{survey && <Survey model={survey} />}</div>
  );
};

const SurveyCompletedPage = () => {
  return (
    <Wrapper className="h-screen">
      <Grid className="h-full">
        <div className="col-start-3 h-full col-span-8 flex flex-col justify-center items-center gap-y-16 my-auto">
          <Text variant="headlineBig" color="black">
            Thank You!
          </Text>
          <Text variant="body" color="black">
            Thank you for completing the survey! Your feedback is valuable to
            us. We appreciate your time and input. If you have any further
            comments or suggestions, please feel free to reach out to us.
          </Text>
          <Link legacyBehavior href="/">
            <Button
              component="a"
              variant="contained"
              color="primary"
              size="large"
              className="text-[1.4rem]"
            >
              Go back home
            </Button>
          </Link>
        </div>
      </Grid>
    </Wrapper>
  );
};

const Mealcreator = () => {
  const [pageState, setPageState] = useState<number>(0);

  // allow multiple meal creation
  // useEffect(() => {
  //   //check if the user finished the survey
  //   const data = localStorage.getItem("surveyData");

  //   if (data !== null) {
  //     const parsedData: ILocalSurveyData = JSON.parse(data);
  //     if (parsedData.hasFinished) {
  //       setPageState(3);
  //     }
  //   }
  // }, []);

  return (
    <div className="relative">
      {pageState === 0 && <BiometricData setPageState={setPageState} />}
      {pageState === 1 && <MealCreationPage setPageState={setPageState} />}
      {pageState === 2 && <SurveyPage setPageState={setPageState} />}
      {pageState === 3 && <SurveyCompletedPage />}
    </div>
  );
};

export default Mealcreator;
