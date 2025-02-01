import { useEffect } from "react";
import PropertyForm from "./components/PropertyForm";
import Sidebar from "@/core/presentation/components/Sidebar";
import { useSearchParams } from "react-router";

const page = () => {
  const [searchParams] = useSearchParams();

  const propertyId = searchParams.get("edit");
  useEffect(() => {
    if (propertyId) {
      console.log("triggered");
    }
  });
  return (
    <div className="min-h-screen w-full flex flex-row ">
      <Sidebar />
      <div className="flex-1 w-full">
        <div className=" p-4">
          <h1 className="text-3xl font-bold mb-5 ">List your property</h1>
          <PropertyForm propertyId={Number(propertyId)} />
        </div>
      </div>
    </div>
  );
};

export default page;
