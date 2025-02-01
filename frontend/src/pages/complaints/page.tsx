import { useAuth } from "@/core/context/authContext";
import Sidebar from "@/core/presentation/components/Sidebar";
import { ComplaintsRepository } from "@/core/repositories/complaintsRepository";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ComplaintsCard from "./components/ComplaintsCard";

const page = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState();
  const fetchComplaints = async () => {
    try {
      const res = await ComplaintsRepository.fetchComplaints(user.user.type);
      console.log(res.results);
      setComplaints(res.results);
    } catch (err) {
      toast("error fetching complaints");
    }
  };
  useEffect(() => {
    fetchComplaints();
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-row ">
      <Sidebar />
      <div className="flex-1 w-full">
        <div className=" p-4">
          <h1 className="text-3xl font-bold">Your complaints</h1>
        </div>
        <div className="p-4">
          <ComplaintsCard data={complaints} />
        </div>
      </div>
    </div>
  );
};

export default page;
