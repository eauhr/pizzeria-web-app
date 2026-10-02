import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import apiClient from "@/lib/apiClient";
import Login from "./Login";
import Register from "./Register";

vi.mock("@/lib/apiClient", () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

function renderWithAuth(page) {
  return render(
    <MemoryRouter>
      <AuthProvider>{page}</AuthProvider>
    </MemoryRouter>,
  );
}

describe("auth forms", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("submits login credentials and stores the returned access token", async () => {
    apiClient.post.mockResolvedValue({
      token: "test-token",
      user: { id: 1, name: "Test Guest", email: "guest@example.com" },
    });
    renderWithAuth(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "guest@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "valid-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
      email: "guest@example.com",
      password: "valid-password",
    }));
    expect(localStorage.getItem("auth_token")).toBe("test-token");
  });

  it("blocks registration when the password confirmation differs", async () => {
    renderWithAuth(<Register />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Guest" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "guest@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "one-password" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "another-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
    expect(apiClient.post).not.toHaveBeenCalled();
  });
});
