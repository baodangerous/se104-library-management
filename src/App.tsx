import * as React from 'react';
import { Toaster, toast } from 'sonner';
import { PublicPortalShell } from './features/portal/PublicPortalShell';
import { WorkspaceApp } from './features/workspace/WorkspaceApp';
import { authService } from './services/authService';
import type { AuthUser } from './types/library';

export default function App() {
  const [initialSession] = React.useState(() => authService.restoreSession());
  const [user, setUser] = React.useState<AuthUser | null>(initialSession?.user ?? null);
  const [mode, setMode] = React.useState<'portal' | 'workspace'>(
    initialSession?.mode ?? 'portal'
  );

  function updateMode(nextMode: 'portal' | 'workspace') {
    setMode(nextMode);
    if (user) {
      authService.saveMode(user.MaTaiKhoan, nextMode);
    }
  }

  function handleLoginSuccess(loggedInUser: AuthUser) {
    setUser(loggedInUser);
    setMode('workspace');
    authService.saveMode(loggedInUser.MaTaiKhoan, 'workspace');
  }

  function handleLogout() {
    authService.logout();
    setUser(null);
    setMode('portal');
    toast.info('Đã đăng xuất khỏi không gian làm việc.');
  }

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      {mode === 'workspace' && user ? (
        <WorkspaceApp
          user={user}
          onBackToPortal={() => updateMode('portal')}
          onLogout={handleLogout}
        />
      ) : (
        <PublicPortalShell
          user={user}
          onLoginSuccess={handleLoginSuccess}
          onEnterWorkspace={() => updateMode('workspace')}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
