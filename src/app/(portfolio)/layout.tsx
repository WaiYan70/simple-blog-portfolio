import { Footer } from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  );
}
