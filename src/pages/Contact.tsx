import { createSignal } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log("Contact form submitted:", {
      name: name(),
      email: email(),
      message: message(),
    });
    alert("Pesan telah dikirim!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <Navbar />
      <div class="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
        <div class="container mx-auto px-6 py-20">
          <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl transition">
            <h1 class="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-8">
              Hubungi Kami
            </h1>

            <form onSubmit={handleSubmit} class="space-y-6">
              <div>
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Nama
                </label>
                <input
                  id="name"
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  placeholder="Nama lengkap Anda"
                  required
                  class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  placeholder="Email aktif Anda"
                  required
                  class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label
                  for="message"
                  class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Pesan
                </label>
                <textarea
                  id="message"
                  value={message()}
                  onInput={(e) => setMessage(e.currentTarget.value)}
                  placeholder="Tulis pesan atau pertanyaan Anda..."
                  rows={5}
                  required
                  class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-md"
              >
                Kirim Pesan →
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
