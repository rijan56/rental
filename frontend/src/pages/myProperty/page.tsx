import Sidebar from "@/core/presentation/components/Sidebar";
import { propertyRepository } from "@/core/repositories/propertyRepository";
import { useEffect, useState } from "react";
import PropertyCard from "../properties/components/PropertyCard";
import { Property } from "../properties/page";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";

const s = () => {
  const [propertyData, setPropertyData] = useState<Property[] | null>();
  const navigate = useNavigate();
  const fetchProperty = async () => {
    const result = await propertyRepository.fetchSelfProperty();
    setPropertyData(result.results);
  };

  useEffect(() => {
    fetchProperty();
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-row ">
      <Sidebar />

      {propertyData !== null ? (
        <div className="flex-grow ">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Explore Properties
            </h1>
          </div>
          <div>
            <PropertyCard data={propertyData!} />
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-center items-center gap-5">
          <div>You have't listed a property yet</div>
          <Button
            className="flex flex-row cursor-pointer bg-primary bg-blue-600"
            onClick={() => navigate("/listproperty")}
          >
            <PlusIcon />
            List Property
          </Button>
        </div>
      )}
    </div>
  );
};

export default s;
