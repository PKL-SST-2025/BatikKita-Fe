import { createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../store/CartContext";

// Simulasi data produk
const products = [
  {
    id: 1,
    name: "Batik Mega Mendung",
    price: 150000,
    description: "Material: Katun\nProses: Tulis",
    image: "/images/batik-1.jpg",
    additionalImages: ["/images/MegaMendung.jpg", "/images/MegaMendung1.jpg"],
  },
  {
    id: 2,
    name: "Batik Kawung",
    price: 923000,
    description: "Material: Rayon\nProses: Printing",
    image: "/images/batik-5.jpg",
    additionalImages: ["/images/batik2.jpg", "/images/batik1.jpg", "/images/batik3.jpg"],
  },
  {
    id: 3,
    name: "Batik Parang",
    price: 189000,
    description: "Material: Katun Primisima\nProses: Cap",
    image: "/images/batik2.jpg",
    additionalImages: ["/images/batik3.jpg", "/images/batik1.jpg", "/images/batik2.jpg"],
  },
];

export default function ProductDetail() {
  const [quantity, setQuantity] = createSignal(1);
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = createSignal(product?.image || "");

  if (!product) {
    return (
      <>
        <Navbar />
        <div class="text-center p-12">Produk tidak ditemukan.</div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity(),
    });
    alert("Produk berhasil ditambahkan ke keranjang");
  };

  return (
    <>
      <Navbar />
      <div class="min-h-screen bg-gradient-to-br from-blue-100 to-white pt-28 pb-16 px-4 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {/* Gambar Produk */}
          <div>
            <img
              src={selectedImage()}
              alt={product.name}
              class="rounded-2xl shadow-lg w-full object-cover max-h-[500px] mb-4"
            />
            <div class="flex gap-4 mt-4">
              {[product.image, ...product.additionalImages].map((img) => (
                <img
                  src={img}
                  alt="Thumbnail"
                  class="w-16 h-16 rounded-lg cursor-pointer border-2 hover:border-black transition"
                  classList={{
                    "border-black": selectedImage() === img,
                    "border-transparent": selectedImage() !== img,
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Detail Produk */}
          <div class="flex flex-col justify-start">
            <h1 class="text-3xl font-heading font-bold mb-4">{product.name}</h1>
            <p class="text-xl text-blue-700 font-semibold mb-3">
              Rp {product.price.toLocaleString()}
            </p>
            <pre class="text-gray-700 font-body whitespace-pre-wrap mb-6">
              {product.description}
            </pre>

            {/* Jumlah */}
            <div class="flex items-center mb-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity() - 1))}
                class="px-3 py-1 bg-gray-200 rounded-l text-lg"
              >
                −
              </button>
              <input
                type="text"
                value={quantity()}
                class="w-12 text-center border-t border-b"
                readOnly
              />
              <button
                onClick={() => setQuantity(quantity() + 1)}
                class="px-3 py-1 bg-gray-200 rounded-r text-lg"
              >
                +
              </button>
            </div>

            {/* Tombol Tambah ke Keranjang */}
            <button
              onClick={handleAddToCart}
              class="flex items-center gap-2 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              <img src="/images/cart.svg" alt="cart" class="w-5 h-5" />
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
