import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import BancoHoras from "./pages/BancoHoras";
import Historico from "./pages/Historico";
import Perfis from "./pages/Perfis";
import PageNotFound from "./lib/PageNotFound";
import PerfilDetalhe from "./pages/PerfilDetalhe";
import Account from "./pages/Account";
import NfcSetup from "./pages/NfcSetup";
import Configuracoes from "./pages/Configuracoes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BancoHoras />} />
          <Route path="historico" element={<Historico />} />
          <Route path="banco" element={<BancoHoras />} />
          <Route path="perfis" element={<Perfis />} />
          <Route path="perfis/:id" element={<PerfilDetalhe />} />
          <Route path="conta" element={<Account />} />
          <Route path="configuracoes" element={<Configuracoes />} />
          <Route path="nfc" element={<NfcSetup />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;