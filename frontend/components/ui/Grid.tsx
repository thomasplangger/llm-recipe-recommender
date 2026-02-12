interface IGrid {
  children?: React.ReactNode;
  className?: string;
}

const Grid = (props: IGrid) => {
  const { children, className = "" } = props;

  if (!children) return null;

  return <div className={`${className} default-grid w-full`}>{children}</div>;
};

export { Grid };
