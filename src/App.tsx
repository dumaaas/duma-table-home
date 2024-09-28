import { BrowserRouter, Route, Routes } from "react-router-dom";
import DumaTable from "./pages/DumaTable";
import 'duma-table/dist/styles.css';

const App = () => (
  <BrowserRouter basename="/">
    <Routes>
      <Route path="/" Component={DumaTable} />
    </Routes>
  </BrowserRouter>
);

export default App;
