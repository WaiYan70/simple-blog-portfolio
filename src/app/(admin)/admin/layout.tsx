export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="text-stone-950 bg-stone-100">{children}</div>;
}
