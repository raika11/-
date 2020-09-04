import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import styles from '~/assets/jss/components/WmsBreadcrumbStyle';

const useStyle = makeStyles(styles);

const WmsBreadcrumb = (props) => {
    const { children, component, maxItems, separator, color } = props;
    const classes = useStyle();

    const breadcrumbForm = () => {
        return (
            <div className={classes.breadcrumbForm}>
                <Breadcrumbs
                    className={classes[color]}
                    separator={separator}
                    maxItems={maxItems}
                    component={component}
                >
                    {children}
                </Breadcrumbs>
            </div>
        );
    };

    return breadcrumbForm();
};

WmsBreadcrumb.propTypes = {
    children: PropTypes.node.isRequired,
    component: PropTypes.elementType,
    maxItems: PropTypes.number,
    separator: PropTypes.object.isRequired
};

WmsBreadcrumb.defaultProps = {
    component: undefined,
    maxItems: undefined
};

export default WmsBreadcrumb;
