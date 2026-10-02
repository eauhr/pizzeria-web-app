import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthContext from "@/contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function renderProtectedRoute(isAuthenticated) {
  return render(
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoadingAuth: false,
      authChecked: true,
      authError: null,
      checkUserAuth: vi.fn(),
    }}>
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route element={<ProtectedRoute unauthenticatedElement={<p>Sign in required</p>} />}>
            <Route path="/private" element={<p>Private account</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ProtectedRoute", () => {
  it("keeps private content hidden from signed-out users", () => {
    renderProtectedRoute(false);
    expect(screen.getByText("Sign in required")).toBeInTheDocument();
    expect(screen.queryByText("Private account")).not.toBeInTheDocument();
  });

  it("shows the nested page after authentication", () => {
    renderProtectedRoute(true);
    expect(screen.getByText("Private account")).toBeInTheDocument();
  });
});
