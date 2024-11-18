import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home, { calculateAge, formSchema } from '@/pages';
import { toast } from 'sonner';

// Mock du toaster
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('Home Component Tests', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('calcul de l\'âge', () => {
        const birthdate = new Date('2000-01-01');
        const age = calculateAge(birthdate);
        expect(age).toBeGreaterThan(23); // En fonction de l'année actuelle
    });

    test('âge > 18 ans (validation zod)', () => {
        const invalidDate = new Date();
        invalidDate.setFullYear(invalidDate.getFullYear() - 17); // Moins de 18 ans
        const result = formSchema.safeParse({
            firstname: 'Jean',
            lastname: 'Dupont',
            email: 'jean.dupont@example.com',
            birthdate: invalidDate,
            city: 'Paris',
            postalCode: '75001',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Vous devez avoir au moins 18 ans.');
        }
    });

    test('format du code postal', () => {
        const result = formSchema.safeParse({
            firstname: 'Jean',
            lastname: 'Dupont',
            email: 'jean.dupont@example.com',
            birthdate: new Date('2000-01-01'),
            city: 'Paris',
            postalCode: '7500A', // Code postal invalide
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Le code postal doit être un nombre de 5 chiffres.');
        }
    });

    test('format des noms et prénoms (caractères spéciaux interdits)', () => {
        const result = formSchema.safeParse({
            firstname: 'Jean@',
            lastname: 'Dupont',
            email: 'jean.dupont@example.com',
            birthdate: new Date('2000-01-01'),
            city: 'Paris',
            postalCode: '75001',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Le prénom contient des caractères invalides.');
        }
    });

    test('format de l\'email (validation zod)', () => {
        const result = formSchema.safeParse({
            firstname: 'Jean',
            lastname: 'Dupont',
            email: 'invalid-email',
            birthdate: new Date('2000-01-01'),
            city: 'Paris',
            postalCode: '75001',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('L\'email n\'est pas valide.');
        }
    });

    // test('désactivation du bouton si les champs ne sont pas remplis', () => {
    //     render(<Home />);
    //     const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
    //     expect(submitButton).toBeDisabled();
    // });

    // test('sauvegarde dans localStorage et affichage du toast de succès', async () => {
    //     render(<Home />);
    //     const firstnameInput = screen.getByPlaceholderText('Prénom');
    //     const lastnameInput = screen.getByPlaceholderText('Nom');
    //     const emailInput = screen.getByPlaceholderText('Email');
    //     const cityInput = screen.getByPlaceholderText('Ville');
    //     const postalCodeInput = screen.getByPlaceholderText('Code postal');
    //     const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
    //
    //     // Remplir les champs
    //     fireEvent.change(firstnameInput, { target: { value: 'Jean' } });
    //     fireEvent.change(lastnameInput, { target: { value: 'Dupont' } });
    //     fireEvent.change(emailInput, { target: { value: 'jean.dupont@example.com' } });
    //     fireEvent.change(cityInput, { target: { value: 'Paris' } });
    //     fireEvent.change(postalCodeInput, { target: { value: '75001' } });
    //
    //     fireEvent.click(submitButton);
    //
    //     await waitFor(() => {
    //         expect(localStorage.getItem('user')).toBeTruthy();
    //         expect(toast.success).toHaveBeenCalledWith('Inscription réussie !');
    //     });
    // });

    // test('affichage des erreurs et toast d\'erreur', async () => {
    //     render(<Home />);
    //     const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
    //
    //     fireEvent.click(submitButton);
    //
    //     await waitFor(() => {
    //         expect(toast.error).toHaveBeenCalledWith(
    //             expect.stringContaining('Veuillez corriger les erreurs suivantes :')
    //         );
    //     });
    // });
});
