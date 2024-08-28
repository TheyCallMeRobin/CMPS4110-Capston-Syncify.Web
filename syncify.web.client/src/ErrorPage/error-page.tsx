import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <center>
                <h1>Oopsie Woopsie! Make a wittle ewwor!</h1>
                <h2>Pwease don't do it again :)</h2>
                <p>
                    <i style={{ color: 'white' }}>{error.statusText || error.message}</i>
                </p>
            </center>

        </div>
    );
}

