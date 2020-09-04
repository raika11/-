import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MonacoEditor from '@ssc/react-monaco-editor';

let errorDecoId = 0;

/**
 * WmsEditor
 * https://blog.expo.io/building-a-code-editor-with-monaco-f84b3a06deaf
 * @param {object} props.options 에디터 옵션
 * @param {bool} props.error 에러여부
 * @param {number} props.errorline 에러라인
 * @param {string} props.errorMessage 에러메세지
 * @param {string} props.tag 삽입태그
 * @param {func} props.onBlur blur 콜백 함수
 * @param {string} props.value 에디터 본문
 */
const WmsEditorCore = (props) => {
    const { options, error, errorline, errorMessage, tag, onBlur, value, ...rest } = props;
    const dispatch = useDispatch();
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const [selection, setSelection] = useState({});

    useEffect(() => {
        if (editorRef.current) {
            if (value) {
                editorRef.current.setValue(value);
            } else {
                editorRef.current.setValue('');
            }
        }
    }, [value]);

    const removeDecoration = (decoId) => {
        editorRef.current.deltaDecorations(
            [decoId],
            [
                {
                    range: new monacoRef.current.Range(0, 0, 0, 0),
                    options: {}
                }
            ]
        );
    };

    useEffect(() => {
        /**
         * syntax 문법 에러 시 에러라인 데코레이션 처리
         */
        if (error && editorRef.current && monacoRef.current) {
            const extra = Number(errorline) + 1;
            editorRef.current.revealLine(extra);
            editorRef.current.setPosition({ lineNumber: extra, column: 1 });
            const decos = editorRef.current.deltaDecorations(
                editorRef.current.getModel().getAllDecorations(),
                [
                    {
                        range: new monacoRef.current.Range(errorline, 1, errorline, 1),
                        options: {
                            isWholeLine: true,
                            className: 'errorContextDecoration',
                            glyphMarginClassName: 'errorContextGlyphMargin',
                            glyphMarginHoverMessage: [
                                { value: '**커스텀 태그 에러**' },
                                { value: errorMessage || '문법 오류' }
                            ]
                        }
                    }
                ]
            );
            if (errorDecoId !== decos[0]) removeDecoration(errorDecoId);
            // eslint-disable-next-line prefer-destructuring
            errorDecoId = decos[0];
            editorRef.current.focus();
        } else if (!error) {
            // 데코레이션 제거
            if (errorDecoId !== 0) {
                removeDecoration(errorDecoId);
                errorDecoId = 0;
            }
        }
    }, [dispatch, error, errorMessage, errorline]);

    useEffect(() => {
        if (tag && editorRef.current && monacoRef.current) {
            const str = tag.substr(13);
            const range = new monacoRef.current.Range(
                selection.startLineNumber,
                selection.startColumn,
                selection.endLineNumber,
                selection.endColumn
            );

            editorRef.current.executeEdits('', [{ range, text: str, forceMoveMarkers: true }]);

            const moveRange = new monacoRef.current.Range(
                selection.startLineNumber + 1,
                0,
                selection.endLineNumber + 1,
                0
            );
            editorRef.current.setSelection(moveRange);
            editorRef.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, tag]);

    /**
     * editor 마운트 되었을 때 실행
     * @param {object} editor 에디터 인스턴스
     * @param {object} monaco 모나코
     */
    const editorDidMount = useCallback(
        (editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;

            /**
             * onBlur
             */
            editor.onDidBlurEditorText(() => {
                if (typeof onBlur === 'function') {
                    onBlur(editor.getValue());
                }
            });

            editor.onDidChangeCursorSelection((e) => {
                // ContentFlush가 아닐때만 커서위치 저장
                if (e.reason !== 1) {
                    setSelection({
                        startLineNumber: e.selection.startLineNumber,
                        startColumn: e.selection.startColumn,
                        endLineNumber: e.selection.endLineNumber,
                        endColumn: e.selection.endColumn
                    });
                }
            });
        },
        [onBlur]
    );

    return (
        <MonacoEditor
            {...rest}
            options={options}
            theme="mtmlCustomTheme"
            editorDidMount={editorDidMount}
        />
    );
};

export default WmsEditorCore;
