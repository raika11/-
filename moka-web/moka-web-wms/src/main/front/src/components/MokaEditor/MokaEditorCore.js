import React, { Suspense, useEffect, useState, useCallback, forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import defaultOptions from './options';
import { MokaIcon } from '@components';

const MonacoEditor = React.lazy(() => import('./MonacoEditor'));
let errorDecoId = 0;

const propTypes = {
    ...MonacoEditor.propTypes,
    /**
     * 전체화면 버튼 노출
     * @default
     */
    fullWindowButton: PropTypes.bool,
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
    /**
     * Blur 이벤트 콜백
     * @param {string} value
     */
    onBlur: PropTypes.func,
};
const defaultProps = {
    langunage: 'html',
    error: {},
    fullWindowButton: false,
};

/**
 * MokaEditor
 * - error 처리
 * - tag 삽입 처리
 */
const MokaEditorCore = forwardRef((props, ref) => {
    const {
        // editor props
        defaultValue,
        value,
        language,
        options,
        theme,
        // etc
        onBlur,
        error,
        tag,
        fullWindowButton,
    } = props;

    const editorRef = useRef(null);
    const [expansion, setExpansion] = useState(false);
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
     * 에디터 decoration 제거
     * @param {any} decoId decoId
     */
    const removeDecoration = (decoId) => {
        const editorInstance = editorRef.current.editorInstance;
        const monaco = editorRef.current.monaco;

        if (editorInstance && monaco) {
            editorInstance.deltaDecorations(
                [decoId],
                [
                    {
                        range: new monaco.Range(0, 0, 0, 0),
                        options: {},
                    },
                ],
            );
        }
    };

    useEffect(() => {
        // 에러 line 처리
        if (error.line) {
            const lineNumber = Number(error.line);
            const editorInstance = editorRef.current.editorInstance;
            const monaco = editorRef.current.monaco;

            if (editorInstance) {
                editorInstance.revealLine(lineNumber);
                editorInstance.setPosition({ lineNumber, column: 1 });

                if (monaco) {
                    const decos = editorInstance.deltaDecorations(editorInstance.getModel().getAllDecorations(), [
                        {
                            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                            options: {
                                isWholeLine: true,
                                className: 'errorContextDecoration',
                                glyphMarginClassName: 'errorContextGlyphMargin',
                                glyphMarginHoverMessage: [{ value: '**TEMS 소스 에러**' }, { value: error.message || '문법 오류' }],
                            },
                        },
                    ]);
                    if (errorDecoId !== decos[0]) removeDecoration(errorDecoId);
                    errorDecoId = decos[0];
                    editorInstance.focus();
                }
            }
        } else if (!error.line) {
            // 데코레이션 제거
            if (errorDecoId !== 0) {
                removeDecoration(errorDecoId);
                errorDecoId = 0;
            }
        }
    }, [error]);

    useEffect(() => {
        // tag가 있으면 태그 삽입
        if (tag && tag !== '') {
            const editor = editorRef.current;

            if (editor) {
                const monaco = editor.monaco;
                const editorInstance = editor.editorInstance;
                const str = tag.substr(13);
                editor.insertText(str);

                // 태그 넣은 후 개행 생성
                if (monaco && editorInstance) {
                    const c = editorInstance.getSelection();
                    const moveRange = new monaco.Range(c.startLineNumber + 1, str.length, c.endLineNumber + 1, str.length);
                    editorInstance.setSelection(moveRange);
                    editorInstance.focus();
                }
            }
        }
    }, [tag]);

    return (
        <Suspense>
            <div className={clsx('w-100 h-100', { 'position-relative': !expansion, 'fixed-top': expansion })} style={{ zIndex: expansion ? 3 : undefined }}>
                {fullWindowButton && (
                    <Button variant="white" className="absolute-top-right border py-0 px-1" onClick={() => setExpansion(!expansion)} style={{ right: 15, zIndex: 1 }}>
                        <MokaIcon iconName={expansion ? 'fal-compress-arrows-alt' : 'fal-expand-arrows'} />
                    </Button>
                )}
                <MonacoEditor
                    ref={editorRef}
                    defaultValue={defaultValue}
                    value={value}
                    theme={theme}
                    language={language}
                    options={{ ...defaultOptions, ...options, glyphMargin: error.line }}
                    editorDidMount={editorDidMount}
                />
            </div>
        </Suspense>
    );
});

MokaEditorCore.propTypes = propTypes;
MokaEditorCore.defaultProps = defaultProps;

export default MokaEditorCore;
