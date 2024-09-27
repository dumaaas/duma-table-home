import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const App = () => (
  <BrowserRouter basename="/">
    <Routes>
      <Route path="/" Component={Home} />
    </Routes>
  </BrowserRouter>
);

export default App;
