'use client';

import propertyService from "@/services/propertyService";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBar = () => {

  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [propertyTypesList, setPropertyTypesList] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [errorTypes, setErrorTypes] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoadingTypes(true);
        setErrorTypes(null); // Reset error before fetching
        const types = await propertyService.getPropertyTypes();
        setPropertyTypesList(types);
      } catch (error: any) {
        const errMsg = error.response?.data?.message || error.message || "Failed to fetch property types";
        setErrorTypes(errMsg);
        console.error('Failed to fetch property types:', errMsg);
      } finally {
        setLoadingTypes(false)
      }
    };
    fetchPropertyTypes();
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();
    if (propertyType) {
      queryParams.append('type', propertyType);
    }

    if (location) {
      queryParams.append('location', location);
    }

    router.push(`/properties?${queryParams.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4 bg-[var(--card-bg)]/20 rounded-xl shadow-md p-4 md:p-6 w-full max-w-3xl mx-auto"
    >
      {/* Property Type Select */}
      <div className="flex-1 min-w-[150px]">
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent text-[var(--foreground)] text-base font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200"
          disabled={loadingTypes}
        >
          <option value="">
            {loadingTypes ? 'Loading property types...' : 'Select Property Type'}
          </option>
          {propertyTypesList.map((type) => (
            <option value={type} key={type}>{type}</option>
          ))}
        </select>
        {errorTypes && (
          <div className="mt-2 text-sm text-[var(--secondary)] font-medium">
            {errorTypes}
          </div>
        )}
      </div>

      {/* Location Input */}
      <div className="flex-1 min-w-[150px]">
        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-transparent text-[var(--foreground)] text-base font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3 rounded-lg bg-[var(--primary)] cursor-pointer text-white font-semibold text-base flex items-center justify-center gap-2 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all duration-200"
      >
        Search <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;