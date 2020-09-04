import React, { useRef, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { WmsButton } from '~/components';
import { API_BASE_URL } from '~/constants';
import { previewComponent } from '~/stores/page/mergeStore';

/**
 * 데스킹 편집폼 > 미리보기
 */
const DeskingPreView = (props) => {
    const { component = {}, classes } = props;
    const match = useRouteMatch();
    const paramSeq = Number(match.params.pageSeq);
    const iframeRef = useRef();
    const dispatch = useDispatch();
    const { content, error, loading } = useSelector(({ mergeStore, loadingStore }) => ({
        content: mergeStore.content,
        error: mergeStore.error,
        loading: loadingStore['mergeStore/PREVIEW_COMPONENT']
    }));
    const [componentWorkSeq, setComponentWorkSeq] = useState(null);

    useEffect(() => {
        if (component.seq && component.seq !== componentWorkSeq) {
            const option = {
                pageSeq: paramSeq,
                componentWorkSeq: component.seq
            };
            setComponentWorkSeq(component.seq);
            dispatch(previewComponent(option));
        }
    }, [component.seq, dispatch, paramSeq, componentWorkSeq, component.editionSeq]);

    useEffect(() => {
        if (iframeRef.current && content !== null) {
            const doc = iframeRef.current.contentDocument;
            doc.open();
            doc.write(content);
            doc.close();
        }
    }, [content]);

    const handleCPreviewClicked = () => {
        let url = null;
        if (component.seq) {
            // eslint-disable-next-line max-len
            url = `${API_BASE_URL}/preview/desking/component?pageSeq=${paramSeq}&componentWorkSeq=${component.seq}`;
            window.open(url, '컴포넌트 미리보기');
        }
    };

    return (
        <>
            <div className={classes.previewTopButtom}>
                <Typography
                    variant="h6"
                    component="p"
                    className={clsx(classes.readText, classes.pl8)}
                >
                    미리보기
                </Typography>
                <WmsButton
                    color="default"
                    overrideClassName={classes.pr8}
                    onClick={handleCPreviewClicked}
                >
                    <span>전체화면으로 보기</span>
                </WmsButton>
            </div>
            <div className={clsx(classes.preview, classes.mt8)}>
                {loading && <div>Loading...</div>}
                <iframe
                    ref={iframeRef}
                    title="컴포넌트미리보기"
                    width={component.templateWidth + 16 || '800'}
                    height="384"
                    frameBorder="0"
                />
            </div>
        </>
    );
};

export default DeskingPreView;
