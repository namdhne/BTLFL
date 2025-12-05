import { getAllProducts } from "@/services/ProductService";
import { addToCart, updateQuantity } from "@/store/CartReducer";
import type { AppDispatch, RootState } from "@/store/store";
import type { Cart } from "@/types/Cart";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { ShoppingCart, Star, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { AiOutlineDollarCircle, AiOutlineThunderbolt } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toast from "@/components/Toast";

const PRODUCTS_PER_PAGE = 4;

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const cart: Cart[] = useSelector((state: RootState) => state.cart);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Product[]> = await getAllProducts();
        console.log(response);
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (cart.some((item) => item._id === product._id)) {
      dispatch(updateQuantity({ productId: product._id, quantity: 1 }));
      setToastMessage(`Đã thêm "${product.title}" vào trong giỏ hàng!`);
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

  // Lọc sản phẩm theo tìm kiếm
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset về trang 1 khi tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-400">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Truyện Nổi Bật
          </h2>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm truyện, tiểu thuyết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-5 pr-12 rounded-lg bg-gradient-to-r from-blue-950 to-purple-950 border border-blue-700 text-white placeholder-blue-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-blue-300 text-lg">Không tìm thấy truyện nào phù hợp với "{searchQuery}"</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => {
            const discountedPrice = calculateDiscountedPrice(
              product.price,
              product.discountPercentage
            );

            return (
              <div
                key={product._id}
                className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl overflow-hidden hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 w-full h-64 ">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{product.discountPercentage}%
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-blue-900/80 backdrop-blur-sm text-blue-100 px-3 py-1 rounded-full text-xs">
                    Còn {product.stock} sp
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star
                        className="text-yellow-400 fill-yellow-400"
                        size={16}
                      />
                      <span className="text-white font-semibold">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-blue-300 text-sm">
                      ({product.stock} đánh giá)
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-2 min-h-14">
                    {product.title}
                  </h3>

                  <p className="text-blue-200 text-sm line-clamp-2 min-h-10">
                    {product.description}
                  </p>

                  <div className="pt-2 border-t border-blue-800">
                    {product.discountPercentage > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {formatPrice(discountedPrice)}
                          </span>
                        </div>
                        <span className="text-blue-400 line-through text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/50"
                    >
                      <Eye size={20} />
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-purple-500/50"
                    >
                      <ShoppingCart size={20} />
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/50"
                          : "bg-gradient-to-r from-blue-950 to-purple-950 text-blue-200 border border-blue-700 hover:border-purple-500"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6 text-center hover:border-blue-600 transition-all hover:shadow-lg hover:shadow-blue-500/20">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TiTick size={32} className="text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">
            Sách Chính Hãng
          </h3>
          <p className="text-blue-200 text-sm">
            Cam kết 100% sách chính hãng, chất lượng đảm bảo
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-purple-800 rounded-xl p-6 text-center hover:border-purple-600 transition-all hover:shadow-lg hover:shadow-purple-500/20">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AiOutlineDollarCircle size={32} className="text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">
            Giá Ưu Đãi
          </h3>
          <p className="text-purple-200 text-sm">
            Giá tốt nhất thị trường, nhiều chương trình khuyến mãi
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-pink-800 rounded-xl p-6 text-center hover:border-pink-600 transition-all hover:shadow-lg hover:shadow-pink-500/20">
          <div className="bg-gradient-to-br from-pink-600 to-pink-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AiOutlineThunderbolt size={32} className="text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">
            Giao Hàng Nhanh
          </h3>
          <p className="text-pink-200 text-sm">Miễn phí ship toàn quốc đơn từ 150k</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
