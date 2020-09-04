import React, { useState, useEffect, Suspense } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsCard } from '~/components';
import style from '~/assets/jss/pages/Desking/DeskingStyle';
import relStyle from '~/assets/jss/pages/Desking/DeskingRelationStyle';
import DeskingRelationBar from './DeskingRelationBar';

const DeskingRelationInfo = React.lazy(() => import('./DeskingRelationInfo'));
const DeskingHistory = React.lazy(() => import('./DeskingHistory'));
const ArticleList = React.lazy(() => import('../article/ArticleList'));

const useStyles = makeStyles(style);
const useRelStyles = makeStyles(relStyle);
const relationBarInfo = [
    { id: 'info', name: '화면편집정보' },
    { id: 'article', name: '기사리스트' },
    { id: 'image', name: '이미지' },
    { id: 'video', name: '동영상' },
    { id: 'graphic', name: '그래픽' },
    { id: 'bookmark', name: '북마크' },
    { id: 'hist', name: '히스토리' }
];

const DeskingRelationContainer = () => {
    const relClasses = useRelStyles();
    const classes = useStyles();
    const [title, setTitle] = useState('info');
    const [deskingToggleState, setDeskingToggleState] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        true
    ]);
    const [infoDisabled, setInfoDisabled] = useState(false);
    const { component, latestContentsId, openDummyForm, pageInfo } = useSelector((store) => ({
        component: store.deskingStore.component,
        latestContentsId: store.deskingStore.latestContentsId,
        openDummyForm: store.deskingStore.openDummyForm,
        pageInfo: store.deskingStore.pageInfo
    }));

    /**
     * 컨텐츠바 토글에 따른 컴포넌트 show/hide
     * @param {number} idx 토글돼야하는 컴포넌트 순서
     */
    const handleExpansion = (idx) => {
        const result = deskingToggleState.map((t, index) => index === idx);
        setDeskingToggleState(result);
    };

    /**
     * bar component 클릭 콜백
     * @param {string} id  컴포넌트 ID값
     */
    const showComponent = (id) => {
        const idx = relationBarInfo.findIndex((c) => c.id === id);
        setTitle(relationBarInfo[idx].name);
        handleExpansion(idx);
    };

    useEffect(() => {
        if (openDummyForm === true) {
            showComponent('info');
            setInfoDisabled(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openDummyForm]);

    useEffect(() => {
        if (component === null) {
            showComponent('article');
            setInfoDisabled(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [component]);

    useEffect(() => {
        if (latestContentsId !== null) {
            showComponent('info');
            setInfoDisabled(false);
        } else {
            setInfoDisabled(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latestContentsId]);

    return (
        <>
            <WmsCard
                header={false}
                title={title}
                width="calc(100% - 52px)"
                overrideRootClassName={relClasses.relbarLeft}
                overrideClassName={relClasses.infoRoot}
            >
                <div className={relClasses.detail}>
                    <Suspense>
                        <div
                            className={clsx(relClasses.relative, {
                                [relClasses.hide]: !deskingToggleState[0]
                            })}
                        >
                            <DeskingRelationInfo classes={classes} isDummyForm={openDummyForm} />
                        </div>
                    </Suspense>
                    <Suspense>
                        <div className={clsx({ [relClasses.hide]: !deskingToggleState[1] })}>
                            <ArticleList classes={classes} />
                        </div>
                    </Suspense>
                    <Suspense>
                        <div className={clsx({ [relClasses.hide]: !deskingToggleState[6] })}>
                            <DeskingHistory
                                open={deskingToggleState[6]}
                                classes={classes}
                                pageInfo={pageInfo || {}}
                                component={component || {}}
                            />
                        </div>
                    </Suspense>
                </div>
            </WmsCard>
            <WmsCard header={false} width="52" overrideClassName={relClasses.relbar}>
                <DeskingRelationBar
                    infoDisabled={infoDisabled}
                    showComponent={showComponent}
                    relationBarInfo={relationBarInfo}
                    deskingToggleState={deskingToggleState}
                />
            </WmsCard>
        </>
    );
};

export default DeskingRelationContainer;
