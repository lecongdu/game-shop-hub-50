import { useState } from "react";
import { categories, products } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const ProductSection = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState([0, 400000]);

  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === "Tất cả" || p.category === activeCategory;
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchCategory && matchPrice;
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">Sản phẩm</h2>
        </div>

        {/* Filters */}
        <div className="surface-card rounded-xl p-4 mb-8 space-y-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "neon" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Price range */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Giá:</span>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={400000}
              step={10000}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {(priceRange[0] / 1000).toFixed(0)}k - {(priceRange[1] / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
