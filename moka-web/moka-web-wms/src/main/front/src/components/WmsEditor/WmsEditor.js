import React, { useState, Suspense } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import { makeStyles } from '@material-ui/core/styles';
import { WmsIconButton, WmsToggleButton } from '~/components/WmsButtons';
import WmsLoader from '~/components/WmsLoader';
import WmsCard from '~/components/WmsCard';
import WmsEditorStyle from '~/assets/jss/components/WmsEditorStyle';

const WmsEditorCore = React.lazy(() => import('./WmsEditorCore'));
const useStyle = makeStyles(WmsEditorStyle);

/**
 * WmsEditor
 * @param {string} props.overrideRootClassName rootClassName
 * @param {string} props.overrideClassName className
 * @param {string} props.title 카드헤더타이틀
 * @param {object} props.options 에디터 옵션
 * @param {bool} props.error 에러여부
 * @param {number} props.errorline 에러라인
 * @param {string} props.errorMessage 에러메세지
 * @param {func} props.onExpansion 에디터 확장 후 콜백 함수
 * @param {string} props.errorMeesage 에러메세지
 * @param {bool} props.loading 로딩
 * @param {bool} props.header 에디터 헤더
 */
const WmsEditor = (props) => {
    const {
        overrideRootClassName,
        overrideClassName,
        title,
        options,
        error = false,
        errorline,
        errorMessage,
        tag,
        expansion,
        onExpansion,
        loading,
        header = true,
        ...rest
    } = props;
    const classes = useStyle();
    const [defaultOptions, setDefaultOptions] = useState({
        automaticLayout: true,
        wordWrap: true,
        minimap: {
            enabled: false
        },
        hover: {
            enabled: true
        }
    });
    const [wordWrap, setWordWrap] = useState(true);

    /**
     * 에디터 확장
     */
    const handleExpansion = () => {
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
        setDefaultOptions(() => {
            return produce(defaultOptions, (draft) => {
                draft.wordWrap = !draft.wordWrap;
            });
        });
    };

    return (
        <WmsCard
            title={title}
            overrideRootClassName={overrideRootClassName}
            overrideClassName={clsx(classes.root, overrideClassName)}
            action={
                <>
                    <WmsToggleButton
                        onClick={handleWordWrap}
                        value="check"
                        selected={wordWrap}
                        icon="wrap_text"
                    />
                    <WmsIconButton
                        onClick={handleExpansion}
                        icon={expansion ? 'crop_free' : 'zoom_out_map'}
                    />
                </>
            }
            header={header}
            loading={loading}
        >
            {!header && (
                <WmsToggleButton
                    onClick={handleWordWrap}
                    value="check"
                    selected={wordWrap}
                    color="grey"
                    icon="wrap_text"
                    overrideClassName={classes.overlayIcon}
                />
            )}
            <div className={classes.center}>
                <Suspense fallback={<WmsLoader />}>
                    <WmsEditorCore
                        {...rest}
                        options={{ ...defaultOptions, ...options, glyphMargin: error }}
                        theme="mtmlCustomTheme"
                        error={error}
                        errorline={errorline}
                        errorMessage={errorMessage}
                        tag={tag}
                    />
                </Suspense>
            </div>
        </WmsCard>
    );
};

export default WmsEditor;
