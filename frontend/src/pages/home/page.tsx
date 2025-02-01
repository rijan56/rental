import Sidebar from "@/core/presentation/components/Sidebar";
import { useAuth } from "@/core/context/authContext";
import Header from "./components/Header";

const Page = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1 p-6">
        <Header username={user.user.first_name} />

        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Explore Properties
          </button>
          <button className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
            View Your Agreements
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
