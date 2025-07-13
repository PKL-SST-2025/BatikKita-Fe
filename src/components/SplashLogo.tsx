import { createSignal, onMount } from "solid-js";

export default function SplashLogo() {
  const [visible, setVisible] = createSignal(true);

  onMount(() => {
    setTimeout(() => setVisible(false), 1800); // durasi splash 1.8s
  });

  return visible() ? (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-500">
      <img
        src="/images/logo.png"
        alt="Logo Batikita"
        class="w-32 h-32 animate-scaleFade"
      />
    </div>
  ) : null;
}