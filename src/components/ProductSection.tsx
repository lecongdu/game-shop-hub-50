import { useState } from "react";
import { useProducts } from "@/hooks/use-shop-data";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const ProductSection = () => {
  const { data: products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState([0, 500000]);

  const categories = ["Tất cả", ...new Set((products || []).map((p) => p.category).filter(Boolean))];

  const filteredProducts = (products || []).filter((p) => {
    const matchCategory = activeCategory === "Tất cả" || p.category === activeCategory;
    const matchPrice = (p.price ?? 0) >= priceRange[0] && (p.price ?? 0) <= priceRange[1];
    return matchCategory && matchPrice;
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">Sản phẩm</h2>
        </div>

        <div className="surface-card rounded-xl p-4 mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "neon" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(cat as string)}
                className="text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Giá:</span>
            <Slider value={priceRange} onValueChange={setPriceRange} max={500000} step={10000} className="flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {(priceRange[0] / 1000).toFixed(0)}k - {(priceRange[1] / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
