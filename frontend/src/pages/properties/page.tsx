import Sidebar from "@/core/presentation/components/Sidebar";
import { propertyRepository } from "@/core/repositories/propertyRepository";
import { useEffect, useState } from "react";
import PropertyCard from "./components/PropertyCard";

export interface Property {
  id: number;
  title: string;
  description: string;
  type: "APARTMENT" | "HOUSE";
  address: string;
  location: string;
  price: number;
  thumbnail: string;
  area: number;
  bedrooms_count: number;
  bathrooms_count: number;
  can_accommodate: number;
  facts: {
    parking_spaces: number;
    year_built: number;
  };
  images: {
    id: number;
    file: string;
  }[];
}

const page = () => {
  const [propertyData, setPropertyData] = useState<Property[] | null>();

  const fetchProperties = async () => {
    const result = await propertyRepository.fetchAllProperties();
    setPropertyData(result.results);
  };

  useEffect(() => {
    fetchProperties();
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-row ">
      <Sidebar />
      <div className="flex-grow ">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Explore Properties
          </h1>
          <p className="text-lg text-gray-600">Find your next home with ease</p>
        </div>
        <div>
          <PropertyCard data={propertyData!} />
        </div>
      </div>
    </div>
  );
};

export default page;
