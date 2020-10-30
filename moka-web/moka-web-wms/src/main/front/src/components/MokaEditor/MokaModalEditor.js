import React, { Suspense, useCallback, forwardRef, useState, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import defaultOptions from './options';
import { MokaModal, MokaIcon } from '@components';
import MokaEditor from './MokaEditorCore';

const propTypes = {
    /**
     * modal의 width
     */
    width: PropTypes.number,
    /**
     * modal의 height
     */
    height: PropTypes.number,
    /**
     * modal의 max-width 사이즈
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    /**
     * modal의 className
     */
    className: PropTypes.string,
    /**
     * modal의 bodyClassName
     */
    bodyClassName: PropTypes.string,
    /**
     * modal의 footerClassName
     */
    footerClassName: PropTypes.string,
    /**
     * modal header의 Title
     */
    title: PropTypes.string,
    /**
     * modal footer의 버튼 (상세한 객체 구조는 MokaModal 참조)
     */
    buttons: PropTypes.arrayOf(PropTypes.shape({})),
    /**
     * 로딩 여부
     */
    loading: PropTypes.bool,
    /**
     * ---------------------------------------------------------
     * 에디터가 사용하는 props
     * language
     */
    language: PropTypes.oneOf(['html', 'javascript', 'css', 'json', 'xml']),
    /**
     * 에디터 생성 시에 기본값으로 들어가는 value
     * => defaultValue가 변경되면 에디터가 다시 create된다!
     */
    defaultValue: PropTypes.string,
    /**
     * 에디터가 create된 상태에서, 단순히 에디터의 내용만 바꿈
     */
    value: PropTypes.string,
    /**
     * Blur 이벤트 콜백
     * @param {string} value
     */
    onBlur: PropTypes.func,
    /**
     * 에러표시 객체
     */
    error: PropTypes.shape({
        /**
         * 에러 line 몇번째 줄인지
         */
        line: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        /**
         * 노출할 에러 문구
         */
        message: PropTypes.string,
    }),
    /**
     * 삽입 태그
     */
    tag: PropTypes.string,
};
const defaultProps = {
    // modal props
    width: 837,
    height: 620,
    title: '에디터',
    bodyClassName: 'p-0',
    footerClassName: 'justify-content-center',
    size: 'lg',
    // editor props
    onBlur: null,
    language: 'html',
    defaultValue: '',
};

/**
 * Modal 형태의 에디터
 * (wordwrap 아이콘 있음)
 */
const MokaModalEditor = forwardRef((props, ref) => {
    const { show, onHide, title, width, height, className, bodyClassName, footerClassName, size, buttons, loading } = props;

    // editor props
    const { onBlur, defaultValue, value, language, options, error, tag } = props;

    // editor state
    const [wordWrap, setWordWrap] = useState(defaultOptions.wordWrap);

    /**
     * 에디터 word wrap 옵션 변경
     */
    const handleWordWrap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setWordWrap(!wordWrap);
    };

    return (
        <MokaModal
            title={title}
            width={width}
            height={height}
            className={className}
            bodyClassName={bodyClassName}
            footerClassName={footerClassName}
            show={show}
            onHide={onHide}
            draggable
            size={size}
            buttons={buttons}
            loading={loading}
            centered
        >
            <div className="position-relative h-100 w-100 overflow-hidden">
                {/* 에디터 */}
                <MokaEditor ref={ref} defaultValue={defaultValue} value={value} language={language} options={{ ...options, wordWrap }} onBlur={onBlur} error={error} tag={tag} />

                {/* 워드랩 버튼 */}
                <Button variant="white" className="absolute-top-right border mt-1 mr-3" onClick={handleWordWrap}>
                    <MokaIcon iconName={wordWrap ? 'fal-arrow-to-right' : 'fal-repeat'} />
                </Button>
            </div>
        </MokaModal>
    );
});

MokaModalEditor.propTypes = propTypes;
MokaModalEditor.defaultProps = defaultProps;

export default MokaModalEditor;
