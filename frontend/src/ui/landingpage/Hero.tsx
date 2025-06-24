import Image from "next/image";
import Serachbar from "./Searchbar";
import SearchBar from "./Searchbar";

const HeroSection = () => {
  return (
    <section className="relative w-100% h-screen overflow-hidden">

      <Image src='/images/hero/hero-image.jpg' alt="Hero Image" fill={true}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.7
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text- font-bold">Your Dream Home Awaits</h1>
        <br />
        <p className="mt-2 text-lg md:text-xl lg:text-2xl  max-w-2xl font-semibold text-[var(--foreground)]">
          Discover the perfect place to live, work, and thrive.</p>

          <SearchBar />
      </div>
    </section>
  );
};

export default HeroSection;