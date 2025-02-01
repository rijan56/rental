const Navbar = () => {
  return (
    <nav className="w-full flex justify-center items-center p-4 border-b">
      <ul className="flex space-x-6 text-sm">
        <li className="cursor-pointer hover:text-gray-600">Home</li>
        <li className="cursor-pointer hover:text-gray-600">Houses</li>
        <li className="cursor-pointer hover:text-gray-600">Blog</li>
        <li className="cursor-pointer hover:text-gray-600">Contacts</li>
      </ul>
    </nav>
  );
};

export default Navbar;
