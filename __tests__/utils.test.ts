import { calculateAge } from "@/lib/utils";
import { registerFormSchema } from "@/components/RegistrationForm";
import { loginFormSchema } from "@/components/LoginForm";

describe("Utility functions", () => {
  test("calculateAge returns correct age", () => {
    const birthdate = new Date("2000-01-01");
    const age = calculateAge(birthdate);
    expect(age).toBeGreaterThan(23);
  });

  test("registerFormSchema validates age > 18 years", () => {
    const invalidDate = new Date();
    invalidDate.setFullYear(invalidDate.getFullYear() - 17);
    const result = registerFormSchema.safeParse({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      birthDate: invalidDate,
      city: "Paris",
      postalCode: "75001",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Vous devez avoir au moins 18 ans.",
      );
    }
  });

  test("registerFormSchema validates postal code format", () => {
    const result = registerFormSchema.safeParse({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      birthDate: new Date("2000-01-01"),
      city: "Paris",
      postalCode: "7500A",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Le code postal doit être au format français (5 chiffres)",
      );
    }
  });

  test("registerFormSchema validates name format (no special characters)", () => {
    const result = registerFormSchema.safeParse({
      firstName: "Jean@",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      birthDate: new Date("2000-01-01"),
      city: "Paris",
      postalCode: "75001",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Le prénom ne doit contenir que des lettres, espaces, et tirets",
      );
    }
  });

  test("registerFormSchema validates email format", () => {
    const result = registerFormSchema.safeParse({
      firstName: "Jean",
      lastName: "Dupont",
      email: "invalid-email",
      birthDate: new Date("2000-01-01"),
      city: "Paris",
      postalCode: "75001",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'email n'est pas valide");
    }
  });
});

describe("LoginForm validation", () => {
  test("loginFormSchema validates email format", () => {
    const result = loginFormSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'email n'est pas valide");
    }
  });

  test("loginFormSchema validates password length", () => {
    const result = loginFormSchema.safeParse({
      email: "jean.dupont@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Le mot de passe doit contenir au moins 8 caractères",
      );
    }
  });

  test("loginFormSchema validates valid email and password", () => {
    const result = loginFormSchema.safeParse({
      email: "jean.dupont@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });
});
