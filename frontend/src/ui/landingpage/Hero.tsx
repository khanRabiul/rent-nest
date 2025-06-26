import Image from "next/image";
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

      <div className="absolute inset-0 flex flex-col items-center justify-center lg:gap-2.5">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl text- font-bold text-center">Your Dream Home Awaits</h1>
          <br />
          <p className="mt-2 text-base lg:text-lg  max-w-2xl font-semibold text-[var(--foreground-muted)] text-center">Find the best properties in your desired location.
            Discover the perfect place to live, work, and thrive.</p>

        </div>
        <div>
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;