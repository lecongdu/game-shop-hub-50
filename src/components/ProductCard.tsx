import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePurchase, formatVND } from "@/hooks/use-shop-data";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: {
    id: string | null;
    name: string | null;
    category: string | null;
    description: string | null;
    price: number | null;
    image: string | null;
    stock: number | null;
    sold: number | null;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const purchase = usePurchase();
  const [showResult, setShowResult] = useState(false);
  const [accountData, setAccountData] = useState("");
  
  const inStock = (product.stock ?? 0) > 0;

  const handleBuy = async () => {
    if (!product.id) return;
    try {
      const result = await purchase.mutateAsync(product.id);
      if (result.success) {
        setAccountData(result.account_data || "");
        setShowResult(true);
        toast.success("Mua thành công!");
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="group surface-card rounded-xl overflow-hidden hover:neon-border transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-32 flex items-center justify-center bg-secondary/50">
        <span className="text-5xl">{product.image}</span>
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            Còn {product.stock ?? 0}
          </span>
          <span>Đã bán {product.sold ?? 0}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-display text-lg font-bold text-primary">
            {formatVND(product.price ?? 0)}
          </span>
          {user ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="neon" size="sm" disabled={!inStock} className="gap-1 text-xs">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {inStock ? "Mua ngay" : "Hết hàng"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-display text-foreground">Xác nhận mua hàng</DialogTitle>
                </DialogHeader>
                {showResult ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-neon-green/10 border border-neon-green/30 p-4 text-center">
                      <p className="text-neon-green font-semibold mb-2">🎉 Mua thành công!</p>
                      <p className="text-xs text-muted-foreground mb-2">Thông tin tài khoản:</p>
                      <p className="font-mono text-sm text-foreground bg-secondary rounded p-2 select-all">{accountData}</p>
                    </div>
                    <DialogClose asChild>
                      <Button variant="neon-outline" className="w-full" onClick={() => setShowResult(false)}>Đóng</Button>
                    </DialogClose>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="surface-card rounded-lg p-4">
                      <p className="text-sm text-foreground font-medium">{product.name}</p>
                      <p className="text-lg font-display font-bold text-primary mt-1">{formatVND(product.price ?? 0)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Số tiền sẽ được trừ từ số dư tài khoản của bạn.</p>
                    <Button
                      variant="neon"
                      className="w-full"
                      onClick={handleBuy}
                      disabled={purchase.isPending}
                    >
                      {purchase.isPending ? "Đang xử lý..." : "Xác nhận mua"}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ) : (
            <Link to="/auth">
              <Button variant="neon-outline" size="sm" className="gap-1 text-xs">
                <LogIn className="h-3.5 w-3.5" /> Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
