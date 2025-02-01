import SignUpForm from "./components/SignUpForm";
import { Link } from "react-router";
import { Menu, X, Home } from "lucide-react";
import { useState } from "react";

const SignUp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center"></Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <Home size={18} className="mr-1" />
                  Home
                </Link>
                <Link
                  to="/properties"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Properties
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none  focus:ring-2 foucs:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/properties"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Properties
            </Link>
            <Link
              to="/about"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Contact
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block pl-3 pr-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-row justify-between items-center p-5 w-full">
        <div className="w-1/2 pr-8 text-center">
          <div>
            <h1 className="text-5xl font-extrabold">Rental</h1>
          </div>
          <div className="text-3xl font-semibold">
            Your haven to real-estate
          </div>
        </div>
        <div className="w-1/2 pl-8 flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold">Sign up</h1>
          </div>
          <div>
            <SignUpForm />
          </div>
          <div className="text-center">
            Already have an account?{" "}
            <Link to={"/login"} className="inline underline text-blue-600">
              Log In
            </Link>
          </div>
        </div>
      </div>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 PropertyHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link
                to="/terms"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Privacy
              </Link>
              <Link
                to="/help"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
