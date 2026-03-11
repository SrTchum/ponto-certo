import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import BancoHoras from "./pages/BancoHoras";
import Historico from "./pages/Historico";
import Hoje from "./pages/Hoje";
import HorasAvulsas from "./pages/HorasAvulsas";
import Integracao from "./pages/Integracao";
import Perfis from "./pages/Perfis";
import PageNotFound from "./lib/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hoje />} />
          <Route path="historico" element={<Historico />} />
          <Route path="banco" element={<BancoHoras />} />
          <Route path="avulsas" element={<HorasAvulsas />} />
          <Route path="perfis" element={<Perfis />} />
          <Route path="integracao" element={<Integracao />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;