import {z} from "zod";
import {formSchema} from "@/components/RegistrationForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function registerUser(userData: z.infer<typeof formSchema>) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error("Failed to register user")
  }

  return response.json()
}

export async function loginUser(credentials: { email: string, password: string }) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to login user")
  }

  return response.json()
}

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`)

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  return response.json()
}

export async function deleteUser(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete user")
  }

  return response.json()
}
