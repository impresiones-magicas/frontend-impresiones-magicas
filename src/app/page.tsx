
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedCategories from "@/components/FeaturedCategories";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        <Hero />
        <FeaturedProducts />
        <FeaturedCategories />
      </main>
      <Footer />
    </div>
  );
}
