import React, { useCallback, forwardRef, useState, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrows, faCompressArrowsAlt, faArrowToRight, faRepeat } from '@moka/fontawesome-pro-light-svg-icons';

import MonacoEditor from './MonacoEditor';

const propTypes = {
    /**
     * 에디터 width
     */
    width: PropTypes.number,
    /**
     * 에디터 height
     */
    height: PropTypes.number,
    /**
     * language
     */
    language: PropTypes.oneOf(['html', 'javascript', 'css', 'json', 'xml']),
    /**
     * 에디터 생성 시에 기본값으로 들어가는 value
     */
    defaultValue: PropTypes.string,
    /**
     * additional className
     */
    className: PropTypes.string,
    /**
     * Card.Header Title
     */
    title: PropTypes.string,
    /**
     * Blur 이벤트 콜백
     * @param {string} value
     */
    onBlur: PropTypes.func,
    /**
     * 확장 여부
     */
    expansion: PropTypes.bool,
    /**
     * 확장 버튼 클릭 콜백
     */
    onExpansion: PropTypes.func,
};
const defaultProps = {
    language: 'html',
    defaultValue: '',
    title: '에디터',
    onBlur: null,
    expansion: false,
    onExpansion: null,
};

// 에디터 기본 옵션
const defaultOptions = {
    automaticLayout: true,
    wordWrap: true,
    minimap: { enabled: false },
    hover: { enabled: true },
};

/**
 * Card 형태의 Moka 에디터 컴포넌트
 * (wordwrap, expansion 아이콘 있음)
 */
const MokaCardEditor = forwardRef((props, ref) => {
    const { width, height, defaultValue, language, options,
         className, title, onBlur, expansion, onExpansion } = props;

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
     * 에디터 확장
     */
    const handleExpansion = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onExpansion) {
            onExpansion(!expansion);
        }
    };

    /**
     * 에디터 word wrap 옵션 변경
     */
    const handleWordWrap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setWordWrap(!wordWrap);
    };

    return (
        <Card className={className} style={{ width, height }}>
            <Card.Header className="d-flex justify-content-between align-item-center">
                <Card.Title>{title}</Card.Title>
                <div className="d-flex align-items-center">
                    {/* 워드랩 버튼 */}
                    <Button variant="white" className="p-0 mr-10" onClick={handleWordWrap}>
                        <FontAwesomeIcon icon={wordWrap ? faArrowToRight : faRepeat} />
                    </Button>

                    {/* 확장 버튼 */}
                    <Button variant="white" className="p-0" onClick={handleExpansion}>
                        <FontAwesomeIcon icon={expansion ? faCompressArrowsAlt : faExpandArrows} />
                    </Button>
                </div>
            </Card.Header>

            <Card.Body>
                <MonacoEditor
                    ref={editorRef}
                    defaultValue={defaultValue}
                    language={language}
                    options={{ ...defaultOptions, ...options, wordWrap }}
                    editorDidMount={editorDidMount}
                />
            </Card.Body>
        </Card>
    );
});

MokaCardEditor.propTypes = propTypes;
MokaCardEditor.defaultProps = defaultProps;

export default MokaCardEditor;
