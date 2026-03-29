import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProductSection />
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <span className="font-display text-primary neon-text">ACCSHOP</span> © 2024 — Shop tài khoản uy tín #1 Việt Nam
        </div>
      </footer>
    </div>
  );
};

export default Index;
