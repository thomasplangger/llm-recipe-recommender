"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { Text, Grid, Wrapper } from "components/ui";
import Button from "@mui/material/Button";
import styles from "./Hero.module.css";
import Link from "next/link";

const Hero = () => (
  <div className="relative rounded-b-[2rem] overflow-hidden">
    <Image
      fill
      src="/assets/hero.jpg"
      alt="heroimage"
      className="-z-10 object-cover object-right"
    />
    <Wrapper
      className={`md:pt-[35rem] md:pb-[28.5rem] py-160 pb-80 ${styles.gradient}`}
    >
      <Grid>
        <Text
          className="md:(col-span-9 mb-8) mb-32 col-span-full"
          variant="headlineBig"
          color="sepia"
          as="h1"
        >
          Meal Architect
        </Text>
        <Text
          as="p"
          variant="body"
          color="sepia"
          className="md:col-span-5 col-span-full -mt-32 mb-32"
        >
          Help advance Food Recommender Systems by participating in our short survey! As part of our Bachelor&apos;s thesis at TU Graz, we&apos;re researching Food Recommender Systems. Your input is crucial to our study&apos;s success.
        </Text>
        <div className="col-span-full">
          <Link legacyBehavior href="/mealcreator">
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
    </Wrapper>
  </div>
);

export default Hero;
