import { Users, ShoppingBag, Package, TrendingUp } from "lucide-react";

const stats = [
  { label: "Tổng tài khoản", value: "2,480+", icon: Package, color: "text-primary" },
  { label: "Đã bán", value: "8,960+", icon: ShoppingBag, color: "text-neon-green" },
  { label: "Thành viên", value: "1,580+", icon: Users, color: "text-warning" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <TrendingUp className="h-3.5 w-3.5" />
            Uy tín #1 Việt Nam
          </div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Shop Tài Khoản
            <span className="block text-primary neon-text mt-1">Premium & Gaming</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Mua bán tài khoản Netflix, Spotify, Game và nhiều dịch vụ khác với giá tốt nhất. Giao dịch tự động, bảo hành uy tín.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="surface-card rounded-xl p-4 md:p-6 text-center neon-border hover:scale-105 transition-transform duration-300"
            >
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <div className="font-display text-xl md:text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
