import { Component } from 'react';
import Button from '../Button/Button';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className={styles.wrap} role="alert">
          <div className={styles.icon}>💥</div>
          <h2 className={styles.title}>Something went wrong</h2>
          <p className={styles.message}>
            {this.props.message ?? 'An unexpected error occurred. Try refreshing the page.'}
          </p>
          {this.state.error?.message && (
            <pre className={styles.detail}>{this.state.error.message}</pre>
          )}
          <Button onClick={this.handleReset}>Try Again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
