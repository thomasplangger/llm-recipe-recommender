import { Grid, Text, Wrapper } from "components/ui";
import Image from "next/image";
import Mail from "assets/svg/mail.svg";
import Link from "next/link";

const MailLink = (props: { mail: string }) => {
  const { mail } = props;

  return (
    <Link href={`mailto:${mail}`} className="flex gap-x-16 items-center group">
      <Mail className="flex-shrink-0 w-25 h-20 group-hover:rotate-[20deg] transition-all ease-in " />
      <Text
        color="black"
        variant="body"
        className="group-hover:text-green group-hover:underline"
      >
        {mail}
      </Text>
    </Link>
  );
};

const ContactUs = () => {
  return (
    <div>
      <Wrapper>
        <Grid className="py-100">
          <div className="relative md:col-start-2 md:col-span-5 hidden md:block  col-span-full aspect-[500/500] rounded-tr-[2rem] rounded-b-[2rem] overflow-hidden">
            <Image
              src='/assets/vegetables_heart.png'
              alt="vegetableheart"
              fill
              className="-z-10"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7  col-span-full flex flex-col">
            <Text color="black" variant="headline">
              CONTACT US
            </Text>
            <div className="px-20 pt-20 border-grey-dark border-t border-l rounded-tl-[2rem] h-full">
              <Text
                as="p"
                className="mb-32"
                color="black"
                variant="headlineSmall"
              >
                Have questions or feedback? <br /> Reach Out to Us!
              </Text>
              <div className="flex flex-col gap-y-16 mb-64">
                <MailLink mail="plangger@student.tugraz.at" />
                <MailLink mail="david.rainer@student.tugraz.at" />
              </div>
              <Text
                as="p"
                className="mb-32"
                color="black"
                variant="headlineSmall"
              >
                We&apos;re here to assist!
              </Text>
              <Text
                as="p"
                className="mb-32 md:max-w-[40.2rem]"
                color="black"
                variant="body"
              >
                Contact us today with your questions or suggestions. Our team is
                ready to help and provide prompt assistance. Let us support you
                on your personalized meal creation journey.
              </Text>
            </div>
          </div>
        </Grid>
      </Wrapper>
    </div>
  );
};

export default ContactUs;
