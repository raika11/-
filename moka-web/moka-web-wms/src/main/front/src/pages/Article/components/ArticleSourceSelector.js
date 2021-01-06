import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import ArticleSourceModal from '@pages/Article/modals/ArticleSourceModal';

const propTypes = {
    /**
     * 매체의 타입
     */
    sourceType: PropTypes.oneOf(['DESKING', 'JOONGANG', 'CONSALES', 'JSTORE', 'SOCIAL', 'BULK', 'RCV']),
};
const defaultProps = {
    sourceType: 'JOONGANG',
};

const ArticleSourceSelector = (props) => {
    const { className, value, onChange, sourceType } = props;
    const [show, setShow] = useState(false);

    return (
        <React.Fragment>
            <Button variant="outline-neutral" className={clsx('ft-12', className)} onClick={() => setShow(true)}>
                매체설정하기
            </Button>

            <ArticleSourceModal value={value} sourceType={sourceType} onChange={onChange} show={show} onHide={() => setShow(false)} />
        </React.Fragment>
    );
};

ArticleSourceSelector.propTypes = propTypes;
ArticleSourceSelector.defaultProps = defaultProps;

export default ArticleSourceSelector;
