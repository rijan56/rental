const Header = ({ username }: { username: string }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome back, {username}!
      </h1>
    </div>
  );
};

export default Header;
