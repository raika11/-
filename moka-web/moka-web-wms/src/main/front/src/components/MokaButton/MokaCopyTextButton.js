import React from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

import Button from 'react-bootstrap/Button';
import { MokaIcon } from '@components';
import { notification } from '@utils/toastUtil';

const propTypes = {
    /**
     * 복사 문구
     */
    copyText: PropTypes.string,
};
const defaultProps = {
    copyText: '',
};

/**
 * 태그 복사 버튼
 */
const MokaCopyTextButton = (props) => {
    const { copyText } = props;

    return (
        <Button
            variant="searching"
            disabled={copyText === ''}
            onClick={() => {
                copy(copyText);
                notification('success', '태그를 복사하였습니다');
            }}
        >
            <MokaIcon iconName="fal-copy" />
        </Button>
    );
};

MokaCopyTextButton.propTypes = propTypes;
MokaCopyTextButton.defaultProps = defaultProps;

export default MokaCopyTextButton;
