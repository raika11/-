import React, { useState, useRef, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { MokaIcon } from '@/components';

const propTypes = {
    /**
     * tag div className
     */
    className: PropTypes.string,
    /**
     * tag value
     */
    tags: PropTypes.array,
    /**
     * onChange
     */
    onChange: PropTypes.func,
};

export const defaultProps = {};

/**
 * 공통 Tag Input (수정중)
 */
const MokaTagInput = forwardRef((props, ref) => {
    const { className, value, onChange } = props;
    const tagRef = useRef(null);

    const [tags, setTags] = useState(value);

    const removeTags = (indexToRemove) => {
        setTags([...tags.filter((index) => index !== indexToRemove)]);
    };

    const addTags = (e) => {
        if (e.target.value !== '' && !tags.find((tag) => tag === e.target.value)) {
            setTags([...tags, e.target.value]);
        }
        e.target.value = '';
    };

    return (
        <div ref={tagRef} className={clsx('d-flex', 'flex-wrap', className)}>
            {tags.map((tag, index) => (
                <div key={index} className="tag">
                    <span>{tag}</span>
                    <span onClick={() => removeTags(index)}>
                        <MokaIcon iconName="fal-times" />
                    </span>
                </div>
            ))}
            <input
                type="text"
                onKeyUp={(e) => (e.key === 'Enter' || 'Space' ? addTags(e) : null)}
                // placeholder=""
            />
        </div>
    );
});

MokaTagInput.propTypes = propTypes;
MokaTagInput.defaultProps = defaultProps;

export default MokaTagInput;
