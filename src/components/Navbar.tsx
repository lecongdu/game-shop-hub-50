import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Wallet, Plus, User, Menu, X, ShoppingBag, Shield, Home, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currentUser, formatVND } from "@/data/mock-data";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Trang chủ", icon: Home },
    { to: "/dashboard", label: "Tài khoản", icon: User },
    { to: "/admin", label: "Admin", icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            AC
          </div>
          <span className="font-display text-lg font-bold text-primary neon-text hidden sm:block">
            ACCSHOP
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài khoản..."
            className="pl-9 bg-secondary border-border focus:border-primary"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={isActive(link.to) ? "neon-outline" : "ghost"}
                size="sm"
                className="gap-1.5"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Balance & Deposit */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {formatVND(currentUser.balance)}
            </span>
          </div>
          <Button variant="deposit" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nạp tiền</span>
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden border-t border-border px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm..." className="pl-9 bg-secondary border-border" />
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              <Button
                variant={isActive(link.to) ? "neon-outline" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          <div className="flex sm:hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 mt-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{formatVND(currentUser.balance)}</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
