import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Onboarding screens
import Welcome from "./pages/onboarding/Welcome";
import Account from "./pages/onboarding/Account";

// Main app screens
import Chat from "./pages/Chat";
import History from "./pages/History";
import Themes from "./pages/Themes";
import Profile from "./pages/Profile";
import ParentInfo from "./pages/ParentInfo";

function Router() {
  return (
    <Switch>
      {/* Onboarding flow */}
      <Route path="/" component={Welcome} />
      <Route path="/onboarding/welcome" component={Welcome} />
      <Route path="/onboarding/account" component={Account} />
      
      {/* Main app tabs */}
      <Route path="/chat" component={Chat} />
      <Route path="/history" component={History} />
      <Route path="/themes" component={Themes} />
      <Route path="/profile" component={Profile} />
      <Route path="/parent-info" component={ParentInfo} />
      
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
