import React, { useState, useRef, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// import { propTypes as tagPropTypes } from './MokaTag';
import { MokaIcon } from '@/components';
import toast from '@/utils/toastUtil';
// import MokaTag from './MokaTag';

const propTypes = {
    // ...tagPropTypes,
    /**
     * tag div className
     */
    className: PropTypes.string,
    /**
     * tag value
     */
    value: PropTypes.array,
    /**
     * onChange
     */
    onChange: PropTypes.func,
    /**
     * tags input style
     */
    style: PropTypes.object,
};

export const defaultProps = {};

/**
 * 공통 Tag Input (수정중)
 */
const MokaTagInput = forwardRef((props, ref) => {
    const {
        className,
        value,
        onChange,
        style,
        // 태그 props
        // tag,
        // isEditable,
        // readOnly,
        // updateTag,
        // removeTag,
        // isInvalid,
        // onRemoveBackspace,
    } = props;
    const tagsWrapRef = useRef(null);
    // const tagRef = useRef(null);

    const [tags, setTags] = useState([]);

    /**
     * 태그 추가
     */
    const addTags = (e) => {
        if (e.key === 'Enter' && e.target.value !== '') {
            if (tags.indexOf(e.target.value) > -1) {
                toast.warning('중복된 태그가 존재합니다.');
            } else {
                setTags([...tags, e.target.value]);
            }
            e.target.value = '';
        }

        // (e.key === 'Space' && e.target.value !== '')
    };

    /**
     * 태그 제거
     */
    const removeTags = (index) => {
        setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
    };

    useEffect(() => {
        onChange(tags);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags]);

    return (
        <div ref={tagsWrapRef} className={clsx('form-control', 'moka-tags-input', className)} style={style}>
            {tags.map((tag, index) => (
                <div key={index} className="moka-tag">
                    <span className="tag-title">{tag}</span>
                    <span className="tag-close-icon" onClick={() => removeTags(index)}>
                        <MokaIcon iconName="fal-times" />
                    </span>
                </div>
                // <MokaTag
                //     key={index}
                //     index={index}
                //     value={tag}
                //     editable={isEditable}
                //     readOnly={readOnly || false}
                //     tagRef={tagRef}
                //     update={updateTag}
                //     remove={removeTag}
                //     isInvalid={isInvalid}
                //     onRemoveBackspace={onRemoveBackspace}
                // />
            ))}

            <input
                type="text"
                onKeyUp={addTags}
                // placeholder=""
            />
        </div>
    );
});

MokaTagInput.propTypes = propTypes;
MokaTagInput.defaultProps = defaultProps;

export default MokaTagInput;
