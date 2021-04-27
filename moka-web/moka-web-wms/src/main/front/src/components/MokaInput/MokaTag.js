import React from 'react';
import PropTypes from 'prop-types';
import { MokaIcon } from '@/components';

const propTypes = {};

export const defaultProps = {};

/**
 * 태그 컴포넌트
 */
const MokaTag = (props) => {
    const { index, tag, onDelete } = props;
    return (
        <div key={index} className="moka-tag">
            <span className="tag-title">{tag}</span>
            <span className="tag-close-icon" onClick={() => onDelete(index)}>
                <MokaIcon iconName="fal-times" />
            </span>
        </div>
    );
};

MokaTag.propTypes = propTypes;
MokaTag.defaultProps = defaultProps;

export default MokaTag;
