import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ForgotPassword from '../ForgotPassword';

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

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      <HelmetProvider>
        {ui}
      </HelmetProvider>
    </BrowserRouter>
  );
};

describe('ForgotPassword Component', () => {
  test('renders the component correctly', () => {
    renderWithRouter(<ForgotPassword />);

    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address to reset your password')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Instructions/i })).toBeInTheDocument();
  });

  test('validates email input', async () => {
    renderWithRouter(<ForgotPassword />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /Send Reset Instructions/i });

    // Empty email
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });

  test('shows success message after submission', async () => {
    renderWithRouter(<ForgotPassword />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /Send Reset Instructions/i });

    // Valid email
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.click(submitButton);

    // Verify loading state
    expect(submitButton).toHaveClass('loading');

    // Verify success message after submission (after 1.5 seconds)
    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
      expect(screen.getByText(/We've sent instructions to reset your password to/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Back to Login/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});