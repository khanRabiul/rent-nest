import { Plane } from "lucide-react";
import Link from "next/link";

const RentNestLogo = () => {
  return (
    <>

      <Link href='/' className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold inline-flex items-center gap-1">
          <span className="text-[var(--secondary)] w-6 h-6">
            <Plane />
          </span>
          RentNest</h1>
        <p className="text-xs md:text-sm lg:text-base">Your Next Destination</p>
      </Link>
    </>
  );
};

export default RentNestLogo;