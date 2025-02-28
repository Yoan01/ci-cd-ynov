import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  city: string;
  postalCode: string;
}) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to register user");
  }

  await loginUser({ email: userData.email, password: userData.password });

  return responseData;
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to login user");
  }

  const token = responseData.token;
  if (!token) {
    throw new Error("No token received");
  }

  const decodedToken = jwtDecode<{
    id: string;
    isAdmin: boolean;
    iat: number;
    exp: number;
  }>(token);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(decodedToken));

  return decodedToken;
}

export async function getUsers() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found, authentication required");
  }

  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch users");
  }

  return responseData;
}

export async function deleteUser(userId: string) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found, authentication required");
  }

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
}
