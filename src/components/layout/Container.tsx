type Props = {
  children: React.ReactNode;
};

export const Container = ({ children }: Props) => {
  return <div className="mx-auto w-full max-w-3xl px-4 py-10">{children}</div>;
};
