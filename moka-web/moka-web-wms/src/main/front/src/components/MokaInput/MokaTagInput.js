import React, { useState, useRef, forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// import { propTypes as tagPropTypes } from './MokaTag';
import toast from '@/utils/toastUtil';
import MokaTag from './MokaTag';

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
     * onAddSpace (true면 스페이스 키보드 입력시 태그 추가)
     */
    onAddSpace: PropTypes.bool,
    /**
     * onAllowBlank (true면 공백 태그 허용)
     */
    onAllowBlank: PropTypes.bool,
    /**
     * tags input style
     */
    style: PropTypes.object,
};

export const defaultProps = {
    onAddSpace: false,
    onAllowBlank: true,
};

/**
 * 공통 Tag Input (수정중)
 */
const MokaTagInput = forwardRef((props, ref) => {
    const {
        className,
        value,
        onChange,
        onAddSpace,
        onAllowBlank,
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
    const handleAddTag = (e) => {
        let space = /\s/;
        if (!onAllowBlank && space.exec(e.target.value)) {
            toast.warning('태그는 공백을 사용할 수 없습니다.');
            e.target.value = e.target.value.replace(' ', ''); // 공백제거
            return;
        }

        // Enter(13), Space(32)
        if ((e.keyCode === 13 && e.target.value !== '') || (onAddSpace && e.keyCode === 32 && e.target.value !== '')) {
            e.preventDefault();
            e.stopPropagation();

            // debugger;
            if (tags.indexOf(e.target.value) > -1 || (onAddSpace && tags.indexOf(e.target.value.trim()) > -1)) {
                toast.warning('중복된 태그가 존재합니다.');
            } else {
                // 스페이스 입력 허용시 시작 공백 체크, 입력 후 target값의 공백을 지우고 태그 추가
                if (onAddSpace) {
                    if (e.target.value === ' ') {
                        toast.warning('태그는 공백으로 시작할 수 없습니다.');
                        e.target.value = e.target.value.replace(' ', ''); // 공백제거
                    } else {
                        e.target.value = e.target.value.replace(/(\s*)/g, ''); // 입력 후 공백 제거
                        setTags([...tags, e.target.value]);
                    }
                } else {
                    setTags([...tags, e.target.value]);
                }
            }
            e.target.value = '';
        }
    };

    /**
     * 태그 제거
     */
    const handleClickDelete = (index) => {
        setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
    };

    useEffect(() => {
        if (value) {
            setTags(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        onChange(tags);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags]);

    return (
        <div ref={tagsWrapRef} className={clsx('form-control', 'moka-tags-input', className)} style={style}>
            {tags.map((tag, index) => (
                <MokaTag
                    key={index}
                    index={index}
                    tag={tag}
                    // editable={isEditable}
                    // readOnly={readOnly || false}
                    // tagRef={tagRef}
                    // update={updateTag}
                    onDelete={handleClickDelete}
                    // isInvalid={isInvalid}
                    // onRemoveBackspace={onRemoveBackspace}
                />
            ))}

            <input
                type="text"
                onKeyUp={handleAddTag}
                // placeholder=""
            />
        </div>
    );
});

MokaTagInput.propTypes = propTypes;
MokaTagInput.defaultProps = defaultProps;

export default MokaTagInput;
