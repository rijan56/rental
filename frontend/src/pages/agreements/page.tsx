import { useAuth } from "@/core/context/authContext";
import Sidebar from "@/core/presentation/components/Sidebar";
import { useEffect, useState } from "react";
import AgreementsCard from "./components/AgreementsCard";
import { AgreementsRepository } from "@/core/repositories/agreementsRepository";

const page = () => {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<any[]>();
  const fetchAgreements = async () => {
    const res = await AgreementsRepository.fetchAgreements(user.user.type);
    console.log(res.results);
    setAgreements(res.results);
  };
  useEffect(() => {
    fetchAgreements();
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-row ">
      <Sidebar />
      <div className="flex-1 w-full">
        <div className=" p-4">
          <h1 className="text-3xl font-bold">Your agreements</h1>
        </div>
        <div className="p-4">
          {agreements ? (
            <AgreementsCard data={agreements!} userType={user?.user.type} />
          ) : (
            <div>You have no agreements yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
