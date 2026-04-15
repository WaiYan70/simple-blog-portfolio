type Props = {
  children: React.ReactNode;
};

export function Container({ children }: Props) {
  return <div className="mx-auto max-w-5xl w-full px-4 py-10">{children}</div>;
}
