'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Added to cart:', product.name);
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <Card className="w-full max-w-sm bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        {product.imageUrl && (
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 ? (
              <Badge variant="secondary" className="text-xs">
                In Stock ({product.stock})
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">(4.8)</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}