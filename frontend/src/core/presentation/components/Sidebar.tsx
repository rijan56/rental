import { Button } from "@/components/ui/button";
import { useAuth } from "@/core/context/authContext";
import {
  PlusIcon,
  LogOut,
  Home,
  FileText,
  AlertCircle,
  CreditCard,
  User,
  Building,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const type = user.user.type;

  const isActive = (path: any) => location.pathname === path;

  const navItems = [
    ...(type === "landlord"
      ? [
          {
            label: "List Property",
            icon: <PlusIcon size={18} />,
            path: "/listproperty",
            button: true,
          },
          {
            label: "My Properties",
            icon: <Building size={18} />,
            path: "/myproperty",
          },
        ]
      : []),
    ...(type === "tenant"
      ? [
          {
            label: "Properties",
            icon: <Home size={18} />,
            path: "/properties",
          },
        ]
      : []),
    {
      label: "Agreements",
      icon: <FileText size={18} />,
      path: "/agreements",
    },
    {
      label: "Payments",
      icon: <CreditCard size={18} />,
      path: "/payments",
    },
    {
      label: "Complaints",
      icon: <AlertCircle size={18} />,
      path: "/complaints",
    },
  ];

  return (
    <aside className="min-w-64 max-w-64 p-4 min-h-screen bg-gray-900 text-gray-300 shadow-lg flex flex-col">
      <div className="mb-8 flex items-center justify-center">
        <Building size={24} className="text-blue-500" />
        <h1 className="ml-2 text-xl font-bold text-white">PropertyHub</h1>
      </div>

      <div className="mb-6 flex items-center p-3 bg-gray-800 rounded-lg">
        <User size={20} className="text-blue-400" />
        <span className="ml-2 text-sm font-medium text-white capitalize">
          {type} Account
        </span>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item, index) =>
            item.button ? (
              <li key={index} className="mb-4">
                <Button
                  onClick={() => navigate(item.path)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-colors"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </li>
            ) : (
              <li key={index}>
                <div
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all
                    ${
                      isActive(item.path)
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-800/50"
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
              </li>
            )
          )}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full border-red-700 text-red-500 hover:bg-red-900/20 hover:text-red-400 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Log out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
