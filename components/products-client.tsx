"use client";

import { Category, Product, GalleryItem } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
}

const ProductsClient: React.FC<ProductsClientProps> = ({
  products,
  categories,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<
    string | null
  >(null);
  const [visibleGalleryCount, setVisibleGalleryCount] = useState<number>(30);

  // Handle direct product access via URL
  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId && !selectedProduct) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [searchParams, products, selectedProduct]);

  // Handle category filter from URL
  useEffect(() => {
    const categoryId = searchParams.get("category");
    setSelectedCategory(categoryId);
  }, [searchParams]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : products;

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Update URL with product ID
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("product", product.id);
    router.push(`?${newParams.toString()}`);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);

    // Update URL with category parameter
    const newParams = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      newParams.set("category", categoryId);
    } else {
      newParams.delete("category");
    }

    // Remove any existing product parameter when changing category
    newParams.delete("product");

    const newQuery = newParams.toString();
    router.push(`/products${newQuery ? `?${newQuery}` : ""}`);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedGalleryImage(null);
    setVisibleGalleryCount(30);
    // Remove product ID from URL
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("product");
    const newQuery = newParams.toString();
    // Stay on the same page, just update query parameters
    router.push(`/products${newQuery ? `?${newQuery}` : ""}`);
  };

  const handleShowMoreGallery = () => {
    setVisibleGalleryCount((prev) => prev + 15);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => handleCategorySelect(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
            selectedCategory === null
              ? "bg-amber-800 text-white"
              : "bg-stone-100 text-neutral-700 hover:bg-stone-200"
          }`}
        >
          Tümü
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              selectedCategory === category.id
                ? "bg-amber-800 text-white"
                : "bg-stone-100 text-neutral-700 hover:bg-stone-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product, productIndex) => {
          const imageUrl =
            product.images && product.images.length > 0 && product.images[0].url
              ? product.images[0].url.replace(
                  "/upload/",
                  "/upload/f_webp,q_auto:good,w_600,h_800,c_fit,fl_progressive/"
                )
              : "/mockup.jpeg";

          return (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={() => handleProductSelect(product)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-50 p-3">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#7c2d12_0deg,transparent_60deg,transparent_300deg,#7c2d12_360deg)] opacity-20 animate-[spin_8s_linear_infinite]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-amber-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div className="relative h-full w-full rounded-xl overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.name || "Ürün Görseli"}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    priority={productIndex < 4}
                    fetchPriority={productIndex < 4 ? "high" : "low"}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 p-3 rounded-full">
                      <ZoomIn className="w-6 h-6 text-amber-900" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-amber-950">
                  {product.name}
                </h3>
                <p className="text-sm text-amber-800/70 mt-1">
                  {product.category?.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={handleCloseModal}>
        <DialogContent className="w-[1200px] h-[80vh] p-8 bg-white">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
              <div className="md:col-span-2 space-y-4">
                <div className="relative w-[600px] h-[65vh] overflow-hidden rounded-lg bg-stone-50">
                  <Image
                    src={
                      selectedGalleryImage ||
                      selectedProduct.images?.[0]?.url ||
                      "/mockup.jpeg"
                    }
                    alt={selectedProduct.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                {selectedProduct.gallery &&
                  selectedProduct.gallery.length > 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-6 gap-2">
                        <div
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                            !selectedGalleryImage
                              ? "border-amber-600"
                              : "border-gray-200 hover:border-amber-400"
                          }`}
                          onClick={() => setSelectedGalleryImage(null)}
                        >
                          <Image
                            src={
                              selectedProduct.images?.[0]?.url || "/mockup.jpeg"
                            }
                            alt={selectedProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {selectedProduct.gallery
                          .slice(0, visibleGalleryCount)
                          .map((item: GalleryItem) => (
                            <div
                              key={item.id}
                              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                                selectedGalleryImage === item.image.url
                                  ? "border-amber-600"
                                  : "border-gray-200 hover:border-amber-400"
                              }`}
                              onClick={() =>
                                setSelectedGalleryImage(item.image.url)
                              }
                            >
                              <Image
                                src={item.image.url}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                      </div>

                      {selectedProduct.gallery.length > visibleGalleryCount && (
                        <div className="flex justify-center pt-4">
                          <button
                            onClick={handleShowMoreGallery}
                            className="px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors duration-200 font-medium"
                          >
                            Daha Fazla Göster (
                            {selectedProduct.gallery.length -
                              visibleGalleryCount}{" "}
                            kalan)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              <div className="flex flex-col">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold text-amber-950">
                    {selectedProduct.name}
                  </DialogTitle>
                  <p className="text-amber-700 mt-2 text-lg">
                    {selectedProduct.category?.name}
                  </p>
                </DialogHeader>

                <div className="flex-grow">
                  {selectedProduct.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-amber-900 mb-3">
                        Açıklama
                      </h4>
                      <div className="bg-stone-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedProduct.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsClient;
