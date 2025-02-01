import { useAuth } from "@/core/context/authContext";
import Sidebar from "@/core/presentation/components/Sidebar";
import { AgreementsRepository } from "@/core/repositories/agreementsRepository";
import { propertyRepository } from "@/core/repositories/propertyRepository";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AgreementCard from "./components/AgreementResponseCard";

const page = () => {
  const [agreement, setAgreement] = useState<any>();
  const [property, setProperty] = useState<any>();
  const { id } = useParams();
  const { user } = useAuth();
  console.log("PROPERTY AGREEMENT TO FETCH ", id);

  const fetchAgreement = async () => {
    const res = await AgreementsRepository.fetchAgreement(
      Number(id),
      user?.user.type
    );
    console.log(res);
    fetchProperty(res?.property_id);
    setAgreement(res);
  };

  const fetchProperty = async (propertyId: number) => {
    const res = await propertyRepository.fetchProperty(propertyId);
    console.log(res);
    setProperty(res);
  };

  useEffect(() => {
    fetchAgreement();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-row ">
      <Sidebar />
      <div className="flex-1 w-full">
        {agreement && (
          <div className="flex flex-col gap-5 p-4">
            <h1 className="text-3xl font-bold">View Agreement</h1>
            <div>
              <AgreementCard
                propertyData={property!}
                agreementData={agreement!}
              />
              {/* price thumnail , desc , address, area */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
