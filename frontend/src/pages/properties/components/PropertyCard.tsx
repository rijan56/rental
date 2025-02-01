import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router";

interface Property {
  id: number;
  title: string;
  description: string;
  type: "APARTMENT" | "HOUSE" | "CONDO" | string;
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

const PropertyCard = ({ data }: { data: Property[] }) => {
  const navigate = useNavigate();
  const handleViewDetails = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {data?.map((property, key) => (
        <div
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
          key={key}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={`http://localhost:8000${property.thumbnail}`}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-sm font-medium text-white">
              {property.type}
            </div>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold line-clamp-2">
                {property.title}
              </h3>
              <span className="font-bold">${property.price}</span>
            </div>

            <p className="text-gray-600 text-sm mb-2 truncate">
              {property.address}, {property.area} ft²
            </p>
            <div className="flex justify-between items-center py-2 border-t border-b border-gray-200 my-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">{property.area} ft²</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">
                  {property.bedrooms_count} Bed
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">
                  {property.can_accommodate} Guests
                </span>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-3 line-clamp-2 flex-grow">
              {property.description}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
              <span className="bg-gray-100 rounded-full px-2 py-1">
                Built {property.facts.year_built}
              </span>
              <span className="bg-gray-100 rounded-full px-2 py-1">
                {property.facts.parking_spaces} Parking Spots
              </span>
              <span className="bg-gray-100 rounded-full px-2 py-1">
                {property.bathrooms_count} Bathrooms
              </span>
            </div>

            <Button
              onClick={() => handleViewDetails(property.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium py-2 px-4 rounded transition-colors duration-300 mt-auto"
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyCard;
