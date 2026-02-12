interface IWrapper {
  children?: React.ReactNode;
  className?: string;
}

const Wrapper = (props: IWrapper) => {
  const { children, className = "" } = props;
  if (!children) return null;
  return (
    <div className={`${className} md:px-200 px-16 w-full`}>{children}</div>
  );
};

export { Wrapper };
