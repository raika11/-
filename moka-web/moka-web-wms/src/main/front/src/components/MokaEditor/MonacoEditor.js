import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import * as monaco from '@moka/monaco-editor/esm/vs/editor/editor.api';

// Create Custom Theme
monaco.editor.defineTheme('mokaTheme', {
    base: 'vs',
    inherit: true,
    rules: [
        // ec9900 0000d80000ff
        { token: 'temsTag', foreground: '800000', fontStyle: 'italic bold' },
        { token: 'temsToken', foreground: '0000ff', fontStyle: 'italic bold' },
        { token: 'temsTest', foreground: '00dcff', fontStyle: 'itealic bold' },
    ],
});

const propTypes = {
    /**
     * language
     */
    language: PropTypes.oneOf(['html', 'javascript', 'css', 'json', 'xml']),
    /**
     * defaultValue (기본값)
     */
    defaultValue: PropTypes.string,
    /**
     * theme
     */
    theme: PropTypes.string,
    /**
     * editor options
     */
    options: PropTypes.shape({}),
    /**
     * 에디터가 마운트되었을 때 실행하는 함수
     */
    editorDidMount: PropTypes.func,
};
const defaultProps = {
    language: 'html',
    defaultValue: '',
    theme: 'mokaTheme',
};

/**
 * 모나코 에디터 컴포넌트
 * https://microsoft.github.io/monaco-editor/index.html
 */
const MonacoEditor = forwardRef((props, ref) => {
    const { language, defaultValue, theme, options, editorDidMount } = props;

    const containerElement = useRef(null);
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);

    // 리턴 ref 설정
    useImperativeHandle(ref, () => ({
        container: containerElement.current,
        monaco,
        editorInstance: editorRef.current,
        getValue: () => editorRef.current.getValue(),
    }));

    useEffect(() => {
        // Component Did Mount (에디터 인스턴스 생성)
        const instance = monaco.editor.create(containerElement.current, {
            value: defaultValue,
            language,
            readOnly: false,
            theme,
            ...options,
        });
        setEditor(instance);
        editorRef.current = instance;

        if (editorDidMount) {
            editorDidMount(monaco, instance);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    useEffect(() => {
        // Component Did Update (에디터 업데이트)
        if (editor) {
            editor.updateOptions(options);
        }
    }, [options, editor]);

    useEffect(() => {
        // Component Did Update (에디터 업데이트)
        if (editor) {
            monaco.editor.setModelLanguage(editor.getModel(), language);
        }
    }, [language, editor]);

    useEffect(() => {
        // Component Unmount (에디터 인스턴스를 dispose)
        return () => {
            if (editor) {
                const model = editor.getModel();
                if (model) {
                    model.dispose();
                }
                editorRef.current = null;
            }
        };
    }, [editor]);

    return <div ref={containerElement} className="react-monaco-editor-container w-100 h-100"></div>;
});

MonacoEditor.propTypes = propTypes;
MonacoEditor.defaultProps = defaultProps;

export default MonacoEditor;
