import React from 'react';
import { Route, Switch } from 'react-router-dom';

// layout
import { AuthLayout } from '@layout';

// page
import Page404 from '@page/MokaAuth/Page404';

// component
import { ScrollToTop } from '@component';

const Routes = () => (
    <ScrollToTop>
        <Switch>
            <Route
                render={() => (
                    <AuthLayout>
                        <Page404 defaultLink="/dashboard" />
                    </AuthLayout>
                )}
            />
        </Switch>
    </ScrollToTop>
);

export default Routes;
