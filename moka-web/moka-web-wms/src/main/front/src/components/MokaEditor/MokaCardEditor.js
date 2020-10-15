import React, { useCallback, forwardRef, useState, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { MokaIcon, MokaCard } from '@components';
import defaultOptions from './options';
import MonacoEditor from './MonacoEditor';

const propTypes = {
    /**
     * card의 width
     */
    width: PropTypes.number,
    /**
     * card의 height
     */
    height: PropTypes.number,
    /**
     * card의 className
     */
    className: PropTypes.string,
    /**
     * Card.Header Title
     */
    title: PropTypes.string,
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
    // card props
    title: '에디터',
    // editor props
    language: 'html',
    defaultValue: '',
    onBlur: null,
    expansion: false,
    onExpansion: null,
};

/**
 * Card 형태의 Moka 에디터 컴포넌트
 * (wordwrap, expansion 아이콘 있음)
 */
const MokaCardEditor = forwardRef((props, ref) => {
    const { width, height, defaultValue, language, options, className, title, onBlur, expansion, onExpansion } = props;

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
        <MokaCard
            className={className}
            headerClassName="d-flex justify-content-between align-items-center"
            bodyClassName="overflow-hidden"
            titleClassName="mb-0"
            title={title}
            buttons={[
                // 워드랩 버튼
                {
                    className: 'p-0 mr-10',
                    onClick: handleWordWrap,
                    icon: <MokaIcon iconName={wordWrap ? 'fal-arrow-to-right' : 'fal-repeat'} />,
                },
                // 확장 버튼
                {
                    className: 'p-0',
                    onClick: handleExpansion,
                    icon: <MokaIcon iconName={expansion ? 'fal-compress-arrows-alt' : 'fal-expand-arrows'} />,
                },
            ]}
            width={width}
            height={height}
        >
            <MonacoEditor ref={editorRef} defaultValue={defaultValue} language={language} options={{ ...defaultOptions, ...options, wordWrap }} editorDidMount={editorDidMount} />
        </MokaCard>
    );
});

MokaCardEditor.propTypes = propTypes;
MokaCardEditor.defaultProps = defaultProps;

export default MokaCardEditor;
