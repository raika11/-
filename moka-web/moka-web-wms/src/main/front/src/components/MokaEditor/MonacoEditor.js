import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle, useCallback } from 'react';
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

export const propTypes = {
    /**
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
    const { language, defaultValue, value, theme, options, editorDidMount } = props;

    const containerElement = useRef(null);
    const [editor, setEditor] = useState(null);

    /**
     * 현재의 커서에 text를 추가하는 함수
     */
    const insertText = useCallback(
        (text) => {
            if (editor) {
                const cursorPosition = editor.getSelection();

                editor.pushUndoStop();
                const range = new monaco.Range(cursorPosition.startLineNumber + 1, 0, cursorPosition.endLineNumber + 1, 0);
                editor.executeEdits('insert', [{ range, text, forceMoveMarkers: true }]);
                editor.pushUndoStop();
            }
        },
        [editor],
    );

    // 리턴 ref 설정
    useImperativeHandle(
        ref,
        () => ({
            container: containerElement.current,
            monaco,
            editorInstance: editor,
            getValue: () => editor.getValue(),
            insertText: (text) => insertText(text),
        }),
        [editor, insertText],
    );

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

        if (editorDidMount) {
            editorDidMount(monaco, instance);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    useEffect(() => {
        // Component Did Update (value 변경)
        if (editor) {
            // **** editor.setValue로 처리하지 않는다 ****
            // 에디터 인스턴스의 Undo, Redo 히스토리를 유지해야하므로 아래와 같이 처리함
            editor.pushUndoStop();
            const model = editor.getModel();

            // 기존의 커서 위치 기억
            const c = editor.getSelection();
            const cursorPosition = new monaco.Range(c.startLineNumber, c.startColumn, c.endLineNumber, c.endColumn);

            // executeEdits
            editor.executeEdits('update', [
                {
                    range: model.getFullModelRange(),
                    text: value,
                    forceMoveMarkers: true,
                },
            ]);

            // 원래 커서 위치로 이동
            editor.setSelection(cursorPosition);
            editor.pushUndoStop();
        }
    }, [editor, value]);

    useEffect(() => {
        // Component Did Update (options 변경)
        if (editor) {
            editor.updateOptions(options);
        }
    }, [options, editor]);

    useEffect(() => {
        // Component Did Update (language 변경)
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
            }
        };
    }, [editor]);

    return <div ref={containerElement} className="react-monaco-editor-container w-100 h-100"></div>;
});

MonacoEditor.propTypes = propTypes;
MonacoEditor.defaultProps = defaultProps;

export default MonacoEditor;
