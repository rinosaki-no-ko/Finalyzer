import { useState } from "react";
import "./App.css";
import RecordsPage from "./pages/Records/RecordsPage";
import BudgetPage from "./pages/Budget/BudgetPage";
import AnalyzePage from "./pages/Analyze/AnalyzePage";
import ImportPage from "./pages/Import/ImportPage";
import ExportPage from "./pages/Export/ExportPage";
import SettingsPage from "./pages/Settings/SettingsPage";

const App = () => {
  const pages = {
    records: <RecordsPage />,
    budget: <BudgetPage />,
    analyze: <AnalyzePage />,
    import: <ImportPage />,
    export: <ExportPage />,
    settings: <SettingsPage />,
  };
  const [activePage, setActivePage] = useState("records");

  return (
    <>
      <header className="header-wrapper">
        <div className="header-container">{activePage}</div>
      </header>

      <nav className="page-nav-wrapper">
        <div className="page-nav-container">
          {Object.keys(pages).map((page) => {
            return (
              <button
                key={`${page} page`}
                onClick={() => {
                  setActivePage(page);
                }}
              >
                {page}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="page-wrapper">
        {pages[activePage as keyof typeof pages]}
      </main>
    </>
  );
};

export default App;
