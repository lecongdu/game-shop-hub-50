import { Product, formatVND } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const inStock = product.stock > 0;

  return (
    <div className="group surface-card rounded-xl overflow-hidden hover:neon-border transition-all duration-300 hover:-translate-y-1">
      {/* Image area */}
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
            Còn {product.stock}
          </span>
          <span>Đã bán {product.sold}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-display text-lg font-bold text-primary">
            {formatVND(product.price)}
          </span>
          <Button
            variant="neon"
            size="sm"
            disabled={!inStock}
            className="gap-1 text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {inStock ? "Mua ngay" : "Hết hàng"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
