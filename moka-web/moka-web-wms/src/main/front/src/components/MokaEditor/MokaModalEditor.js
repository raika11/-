import React, { Suspense, useCallback, forwardRef, useState, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import defaultOptions from './options';
import { MokaModal, MokaIcon } from '@components';
const MonacoEditor = React.lazy(() => import('./MonacoEditor'));

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
     * language
     */
    language: PropTypes.oneOf(['html', 'javascript', 'css', 'json', 'xml']),
    /**
     * 에디터 생성 시에 기본값으로 들어가는 value
     */
    defaultValue: PropTypes.string,
    /**
     * Blur 이벤트 콜백
     * @param {string} value
     */
    onBlur: PropTypes.func,
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
    const { show, onHide, title, width, height, className, bodyClassName, footerClassName, size, buttons, onBlur, defaultValue, language, options } = props;

    // editor state
    const [wordWrap, setWordWrap] = useState(defaultOptions.wordWrap);

    const editorRef = useRef(null);
    useImperativeHandle(ref, () => editorRef.current);

    /**
     * editorDidMount
     * @param {object} monaco 모나코 obj
     * @param {object} editor 에디터 instance obj
     */
    const editorDidMount = useCallback(
        (monaco, editor) => {
            /** onDidBlurEditorText */
            if (typeof onBlur === 'function') {
                editor.onDidBlurEditorText(() => {
                    onBlur(editor.getValue());
                });
            }
        },
        [onBlur],
    );

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
            centered
        >
            <div className="position-relative h-100 w-100 overflow-hidden">
                <Suspense>
                    <MonacoEditor
                        ref={editorRef}
                        defaultValue={defaultValue}
                        language={language}
                        options={{ ...defaultOptions, ...options, wordWrap }}
                        editorDidMount={editorDidMount}
                    />
                </Suspense>
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
