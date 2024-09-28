import logo from "../../assets/logo.svg";

const Header = () => {
  return (
    <div className="fixed w-full z-20 h-14 border-b bg-black/90 px-4 border-white flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <img src={logo} alt="logo" className="w-8 stroke-white" />
        <p className="text-lg font-bold text-white">duma-table</p>
      </div>
      <div className="flex items-center gap-3 text-white text-base">
        <a href="/">Home</a>
      </div>
    </div>
  );
};

export default Header;
