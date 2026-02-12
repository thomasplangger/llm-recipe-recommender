interface IText {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  variant?: keyof typeof variants;
  color?: keyof typeof colors;
  className?: string;
}

const variants = {
  headlineBig: "font-headline-big",
  headline: "font-headline",
  headlineSmall: "font-headline-small",
  body: "font-body",
  bodyBold: "font-body-bold",
  eyebrow: "font-eyebrow",
};

const colors = {
  sepia: "text-sepia",
  black: "text-black",
  error: "text-red",
};

const Text = (props: IText) => {
  const {
    as = "span",
    variant = "headline",
    className = "",
    color = "sepia",
    children,
  } = props;

  const Type = as;

  return (
    <Type className={`${className} ${variants[variant]} ${colors[color]}`}>
      {children}
    </Type>
  );
};

export { Text };
