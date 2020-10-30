import React, { Suspense, forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MokaIcon, MokaCard } from '@components';
import defaultOptions from './options';
import MokaEditor from './MokaEditorCore';

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
     * 확장 여부
     */
    expansion: PropTypes.bool,
    /**
     * 확장 버튼 클릭 콜백
     */
    onExpansion: PropTypes.func,
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
    // card props
    title: '에디터',
    expansion: false,
    onExpansion: null,
    // editor props
    language: 'html',
    defaultValue: '',
    onBlur: null,
    error: {},
};

/**
 * Card 형태의 Moka 에디터 컴포넌트
 * (wordwrap, expansion 아이콘 있음)
 */
const MokaCardEditor = forwardRef((props, ref) => {
    const { width, height, defaultValue, value, language, options, className, title, onBlur, expansion, onExpansion, error, tag } = props;

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
            <Suspense>
                <MokaEditor ref={ref} defaultValue={defaultValue} value={value} language={language} options={{ ...options, wordWrap }} onBlur={onBlur} error={error} tag={tag} />
            </Suspense>
        </MokaCard>
    );
});

MokaCardEditor.propTypes = propTypes;
MokaCardEditor.defaultProps = defaultProps;

export default MokaCardEditor;
