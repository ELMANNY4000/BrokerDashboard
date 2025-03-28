import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Transactions from "@/pages/transactions";
import EmailNotifications from "@/pages/email-notifications";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "@/lib/auth";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-slate-100">
      {isAuthenticated && <Sidebar currentPath={location} />}
      <div className={`flex-1 flex flex-col ${isAuthenticated ? 'lg:ml-64' : ''}`}>
        {isAuthenticated && <Header pageTitle={location.slice(1) || 'dashboard'} />}
        <main className={`flex-1 ${isAuthenticated ? 'p-6' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <Component />;
}

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/users" component={() => <ProtectedRoute component={Users} />} />
        <Route path="/transactions" component={() => <ProtectedRoute component={Transactions} />} />
        <Route path="/email-notifications" component={() => <ProtectedRoute component={EmailNotifications} />} />
        <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
