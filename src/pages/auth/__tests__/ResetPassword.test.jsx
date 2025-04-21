import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ResetPassword from '../ResetPassword';

// Mock the NavBar and Footer components
jest.mock('../../../sections/shared/navbar/NavBar', () => {
  return function MockNavBar() {
    return <div data-testid="navbar">NavBar</div>;
  };
});

jest.mock('../../../sections/shared/footer/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?token=mock-token-123'
  })
}));

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      <HelmetProvider>
        {ui}
      </HelmetProvider>
    </BrowserRouter>
  );
};

describe('ResetPassword Component', () => {
  test('renders the component correctly with URL token', () => {
    renderWithRouter(<ResetPassword />);

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByText('Enter your new password below')).toBeInTheDocument();

    // Token should be prefilled from URL
    const tokenInput = screen.getByLabelText('Reset Token');
    expect(tokenInput.value).toBe('mock-token-123');

    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
  });

  test('validates form input', async () => {
    renderWithRouter(<ResetPassword />);

    const tokenInput = screen.getByLabelText('Reset Token');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /Reset Password$/i });

    // Clear token
    fireEvent.change(tokenInput, { target: { value: '' } });

    // Empty fields validation
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Token is required')).toBeInTheDocument();
      expect(screen.getByText('New password is required')).toBeInTheDocument();
      expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    });

    // Password too short
    fireEvent.change(tokenInput, { target: { value: 'token-123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'pass' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'pass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    // Passwords don't match
    fireEvent.change(newPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('shows success message after submission', async () => {
    renderWithRouter(<ResetPassword />);

    const tokenInput = screen.getByLabelText('Reset Token');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /Reset Password$/i });

    // Valid form submission
    fireEvent.change(tokenInput, { target: { value: 'valid-token-123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    // Verify loading state
    expect(submitButton).toHaveClass('loading');

    // Verify success message after submission
    await waitFor(() => {
      expect(screen.getByText('Password Reset Successful')).toBeInTheDocument();
      expect(screen.getByText(/You can now login with your new password/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Login Now/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('toggles password visibility', () => {
    renderWithRouter(<ResetPassword />);

    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    // Initial state: password is hidden
    expect(newPasswordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');

    // Toggle new password visibility
    const newPasswordToggle = screen.getAllByRole('button', { name: '' })[0];
    fireEvent.click(newPasswordToggle);
    expect(newPasswordInput.type).toBe('text');

    // Toggle confirm password visibility
    const confirmPasswordToggle = screen.getAllByRole('button', { name: '' })[1];
    fireEvent.click(confirmPasswordToggle);
    expect(confirmPasswordInput.type).toBe('text');

    // Toggle back
    fireEvent.click(newPasswordToggle);
    expect(newPasswordInput.type).toBe('password');
  });
});