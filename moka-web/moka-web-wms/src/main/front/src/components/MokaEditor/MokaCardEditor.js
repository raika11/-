import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MokaIcon, MokaCard } from '@components';
import defaultOptions from './options';
import MokaEditor, { propTypes as editorProps } from './MokaEditorCore';

const propTypes = {
    ...editorProps,
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
     * 확장 여부
     */
    expansion: PropTypes.bool,
    /**
     * 확장 버튼 클릭 콜백
     */
    onExpansion: PropTypes.func,
    /**
     * 로딩 여부
     */
    loading: PropTypes.bool,
};
const defaultProps = {
    // editor props
    language: 'html',
    defaultValue: '',
    onBlur: null,
    error: {},
    // card props
    title: '에디터',
    expansion: false,
    onExpansion: null,
};

/**
 * Card 형태의 Moka 에디터 컴포넌트
 * (wordwrap, expansion 아이콘 있음)
 */
const MokaCardEditor = forwardRef((props, ref) => {
    const { width, height, className, title, expansion, onExpansion, loading } = props;

    // editor props
    const { defaultValue, value, language, options, onBlur, error, tag } = props;

    // editor state
    const [wordWrap, setWordWrap] = useState(defaultOptions.wordWrap);

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
            title={title}
            buttons={[
                // 워드랩 버튼
                {
                    onClick: handleWordWrap,
                    icon: <MokaIcon iconName={wordWrap ? 'fal-arrow-to-right' : 'fal-repeat'} />,
                },
                // 확장 버튼
                {
                    onClick: handleExpansion,
                    icon: <MokaIcon iconName={expansion ? 'fal-compress-arrows-alt' : 'fal-expand-arrows'} />,
                },
            ]}
            width={width}
            height={height}
            loading={loading}
        >
            <MokaEditor ref={ref} defaultValue={defaultValue} value={value} language={language} options={{ ...options, wordWrap }} onBlur={onBlur} error={error} tag={tag} />
        </MokaCard>
    );
});

MokaCardEditor.propTypes = propTypes;
MokaCardEditor.defaultProps = defaultProps;

export default MokaCardEditor;
