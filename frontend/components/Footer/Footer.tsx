import { Grid, Wrapper, Text, Logo } from "components/ui";

const Footer = () => {
  return (
    <div className="py-50 bg-green">
      <Wrapper>
        <Grid>
          <div className="md:col-start-5 md:col-span-4 col-span-4 flex flex-col">
            <Logo className="w-[15rem] mx-auto mb-16" />
            <hr className="border-sepia mb-16" />
            <Text className="ml-auto" color="sepia" variant="body">
              © 2023
            </Text>
          </div>
        </Grid>
      </Wrapper>
    </div>
  );
};

export default Footer;
