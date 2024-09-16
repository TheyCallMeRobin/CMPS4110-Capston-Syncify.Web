import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";  // Import Link
import { logError } from '../utils/logger';

export default function ErrorPage() {
    const error = useRouteError();

    logError(error);

    let errorMessage: string;
    if (isRouteErrorResponse(error)) {
        errorMessage = `${error.status} ${error.statusText}`;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else {
        errorMessage = "An unexpected error occurred.";
    }

    return (
        <div id="error-page" style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Oops! Something went wrong.</h1>
            <h2>We apologize for the inconvenience.</h2>
            <p>
                <i style={{ color: 'red' }}>{errorMessage}</i>
            </p>
            <p>
                Please try refreshing the page or <Link to="/">return to the homepage</Link>.
            </p>
        </div>
    );
}
