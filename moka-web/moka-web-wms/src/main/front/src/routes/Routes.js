import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// routes
import routes from './index';

// component
import Loader from '@layout/component/Loader';
import { ScrollToTop } from '@component';

const Routes = () => (
    <ScrollToTop>
        <Suspense fallback={<Loader />}>
            <Switch>
                {routes.map(({ path, layout: Layout, component: Component, name, ...rest }) => (
                    <Route
                        key={name}
                        path={path}
                        {...rest}
                        render={(props) => (
                            <Layout>
                                <Component {...props} />
                            </Layout>
                        )}
                    />
                ))}
                <Redirect from="*" to="/404" />
            </Switch>
        </Suspense>
    </ScrollToTop>
);

export default Routes;
