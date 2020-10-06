import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
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
};
const defaultProps = {
    language: 'html',
    defaultValue: '',
};

/**
 * Moka 에디터 컴포넌트
 * (카드 형태, wordwrap 아이콘 있음)
 */
const MokaEditor = forwardRef((props, ref) => {
    const { width, height, defaultValue, language, options } = props;
    const [defaultOptions, setDefaultOptions] = useState({
        automaticLayout: true,
        wordWrap: true,
        minimap: { enabled: false },
        hover: { enabled: true },
    });

    const editorRef = useRef(null);
    useImperativeHandle(ref, () => editorRef.current);

    /**
     * editorDidMount
     * @param {object} monaco 모나코 obj
     * @param {object} editor 에디터 instance obj
     */
    const editorDidMount = (monaco, editor) => {
        /** onDidBlurEditorText */
        editor.onDidBlurEditorText(() => {});
    };

    return (
        <Card className="vh-100" style={{ width, height }}>
            <Card.Header>Test</Card.Header>
            <Card.Body>
                <MonacoEditor ref={editorRef} defaultValue={defaultValue} language={language} options={{ ...defaultOptions, ...options }} editorDidMount={editorDidMount} />
            </Card.Body>
        </Card>
    );
});

MokaEditor.propTypes = propTypes;
MokaEditor.defaultProps = defaultProps;

export default MokaEditor;
