import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { registerUser } from '@/lib/api';
import { calculateAge } from '@/lib/utils';
import RegistrationForm from "@/components/RegistrationForm";

jest.mock('@/lib/api', () => ({
  registerUser: jest.fn(() => Promise.resolve())
}));

describe('RegistrationForm', () => {
  it('renders form fields correctly', () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date de naissance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Code postal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
  });

  it('displays error messages when validation fails', async () => {
    render(<RegistrationForm />);

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText(/Le prénom est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/Le nom est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/L'email n'est pas valide/i)).toBeInTheDocument();
      expect(screen.getByText(/Vous devez avoir au moins 18 ans/i)).toBeInTheDocument();
      expect(screen.getByText(/La ville est requise/i)).toBeInTheDocument();
      expect(screen.getByText(/Le code postal doit être au format français/i)).toBeInTheDocument();
    });
  });

  it('submits the form successfully with valid inputs', async () => {
    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Ville/i), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText(/Code postal/i), { target: { value: '75001' } });

    const validDate = new Date(1990, 1, 1);
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), { target: { value: validDate } });

    const age = calculateAge(validDate);
    expect(age).toBeGreaterThanOrEqual(18);

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/Inscription réussie/i)).toBeInTheDocument();
    });
  });

  it('disables submit button when form is invalid', async () => {
    render(<RegistrationForm />);

    const submitButton = screen.getByRole('button', { name: /S'inscrire/i });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Ville/i), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText(/Code postal/i), { target: { value: '75001' } });

    const validDate = new Date(1990, 1, 1);
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), { target: { value: validDate } });

    expect(submitButton).toBeEnabled();
  });
});
