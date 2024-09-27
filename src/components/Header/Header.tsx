import logo from "../../assets/logo.svg";

const Header = () => {
  return (
    <div className="fixed w-full h-14 border-b bg-black/90 px-4 border-white flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <img src={logo} alt="logo" className="w-8 stroke-white" />
        <p className="text-lg font-bold text-white">Generic table</p>
      </div>
    </div>
  );
};

export default Header;
