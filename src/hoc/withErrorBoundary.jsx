import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';

/**
 * Wraps any component in an ErrorBoundary.
 * @param {React.ComponentType} WrappedComponent
 * @param {{ message?: string, fallback?: React.ReactNode }} options
 */
const withErrorBoundary = (WrappedComponent, options = {}) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithErrorBoundary = (props) => (
    <ErrorBoundary message={options.message} fallback={options.fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
};

export default withErrorBoundary;
