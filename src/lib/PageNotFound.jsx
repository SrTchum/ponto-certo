import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="py-14 text-center">
      <div className="text-3xl font-semibold text-text-1">404</div>
      <div className="mt-2 text-sm text-text-3">Página não encontrada.</div>
      <Link
        to="/banco"
        className="mt-6 inline-flex items-center justify-center rounded-2xl border border-border-1 bg-[rgba(20,40,63,0.45)] px-4 py-2 text-sm font-semibold text-text-1 hover:bg-[rgba(20,40,63,0.6)] transition"
      >
        Voltar para Banco
      </Link>
    </div>
  );
}

