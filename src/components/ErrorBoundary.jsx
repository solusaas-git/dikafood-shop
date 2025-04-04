import React from 'react';
import Button from './buttons/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="container">
            <h1>Oops! Une erreur s'est produite</h1>
            <p>{this.state.error?.message}</p>
            <Button
              name="Retour à l'accueil"
              theme="primary"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 