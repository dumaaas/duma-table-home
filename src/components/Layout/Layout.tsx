import App from "../../App";
import Content from "../Content/Content";
import Header from "../Header/Header";

const Layout = () => (
  <div
    className="relative min-h-screen h-screen w-full bg-gray-300 font-mono overflow-x-hidden"
  >
    <Header />
    <Content>
      <App />
    </Content>
  </div>
);

export default Layout;
