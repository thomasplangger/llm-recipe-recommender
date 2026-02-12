import { Grid, Text } from "components/ui";
import { Wrapper } from "components/ui";
import TUSvg from "assets/svg/tugraz.svg";
import Button from "@mui/material/Button";
import Link from "next/link";

const StudyInfo = () => {
  return (
    <div>
      <Wrapper className="">
        <Grid className="pt-80 pb-160">
          <TUSvg className="md:col-span-4 col-span-full w-full h-auto" />
          <div className="md:col-span-6 md:col-start-6 col-span-full">
            <Text className="mb-16" as="h2" variant="headline" color="black">
              STUDY
            </Text>
            <Text className="mb-32" as="p" variant="body" color="black">
              In our Bachelor&apos;s thesis on Software Engineering and Management at TU Graz, we&apos;re working on Food Recommender Systems. These systems suggest personalized meal options based on user preferences and health status. Your voluntary participation in the survey will help us collect anonymized data for our research, ensuring strict confidentiality and adhering to data protection regulations. Thank you for your valuable support!
            </Text>
            <Link href="/mealcreator" legacyBehavior>
              <Button
                component="a"
                variant="contained"
                color="primary"
                size="large"
                className="text-[1.4rem]"
              >
                Participate Now
              </Button>
            </Link>
          </div>
        </Grid>
        <hr className="mt-auto border-grey-dark" />
      </Wrapper>
    </div>
  );
};

export default StudyInfo;
