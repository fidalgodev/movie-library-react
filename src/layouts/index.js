import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

export default ({ title, description, children }) => {
    return (
        <Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>
                <meta name="description" content="A Movie Library where you can check all your favorite movies, as well as the cast of it, and so mucnh more! Made with ❤️ by Fidalgo" />
                <link rel="canonical" href="https://movies.fidalgo.dev" />
            </Helmet>
            <Fragment>
                { children }
            </Fragment>
        </Fragment>
    );
};
