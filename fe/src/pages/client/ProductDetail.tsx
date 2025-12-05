import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@/services/ProductService";
import { addToCart, updateQuantity } from "@/store/CartReducer";
import type { AppDispatch, RootState } from "@/store/store";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import type { Cart } from "@/types/Cart";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Star, ArrowLeft, Package, TrendingUp } from "lucide-react";
import Toast from "@/components/Toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const cart: Cart[] = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response: ApiResponse<Product> = await getProductById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (cart.some((item) => item._id === product._id)) {
      dispatch(updateQuantity({ productId: product._id, quantity: 1 }));
      setToastMessage(`Đã tăng số lượng "${product.title}" trong giỏ hàng!`);
    } else {
      dispatch(addToCart({ product }));
      setToastMessage(`Đã thêm "${product.title}" vào giỏ hàng!`);
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400 text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-slate-400 text-xl mb-4">Không tìm thấy sản phẩm</div>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-400"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
          <div className="relative">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-auto object-cover"
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                -{product.discountPercentage}%
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-400">
                ({product.rating.toFixed(1)})
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.discountPercentage > 0 ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-red-500">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-xl text-slate-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="text-green-400 text-sm font-medium">
                    Tiết kiệm {formatPrice(product.price - discountedPrice)}
                  </div>
                </>
              ) : (
                <span className="text-4xl font-bold text-slate-100">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Stock & Availability */}
          <div className="flex items-center gap-6 py-4 border-y border-slate-800">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-400" />
              <span className="text-slate-300">
                Còn lại: <span className="font-bold text-slate-100">{product.stock}</span> sản phẩm
              </span>
            </div>
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Còn hàng</span>
              </div>
            ) : (
              <span className="text-red-400 font-medium">Hết hàng</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-100">
              Mô tả sản phẩm
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              product.stock === 0
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
