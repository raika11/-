import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { WmsButton, WmsLoader } from '~/components';
import style from '~/assets/jss/pages/Desking/DeskingListStyle';
import DeskingComponent from './deskingWork/DeskingComponent';
import { API_BASE_URL } from '~/constants';
import { getComponentWorkList, changeContents } from '~/stores/desking/deskingStore';

const useStyles = makeStyles(style);

/**
 * 화면편집 > 편집화면 탭 컨텐츠
 */
const DeskingListContainer = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();
    const paramSeq = Number(match.params.pageSeq);
    const { pageSeq, list, loading } = useSelector(({ deskingStore, loadingStore }) => ({
        pageSeq: deskingStore.search.pageSeq,
        list: deskingStore.list,
        // total: deskingStore.total,
        // error: deskingStore.error,
        loading: loadingStore['deskingStore/GET_COMPONENT_WORK_LIST']
    }));

    useEffect(() => {
        // url로 다이렉트로 페이지 조회하는 경우
        if (paramSeq && paramSeq !== pageSeq) {
            const option = {
                pageSeq: paramSeq,
                direct: true,
                callback: (result) => {
                    if (!result) history.push('/desking');
                }
            };
            dispatch(getComponentWorkList(option));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRowClicked = (params, agGridIndex) => {
        const option = {
            component: list && list[agGridIndex],
            contentsId: params.data.contentsId
        };
        dispatch(changeContents(option));
    };

    const handlePreviewClicked = () => {
        window.open(
            `${API_BASE_URL}/preview/desking/page?pageSeq=${pageSeq}&editionSeq=0`,
            '전체미리보기'
        );
    };

    return (
        <div className={classes.listRoot}>
            {/** 버튼영역 */}
            <div className={classes.topButton}>
                <WmsButton color="wolf" size="long" onClick={handlePreviewClicked}>
                    전체 미리보기
                </WmsButton>
            </div>
            {/** 로딩바 */}
            {loading && (
                <div className={classes.loadingContainer}>
                    <WmsLoader loading={loading} />
                </div>
            )}
            {/** 컴포넌트 목록 */}
            <div className={classes.contents}>
                {!loading &&
                    list &&
                    list.map((comp, index) => {
                        return (
                            <DeskingComponent
                                key={`${pageSeq}-${comp.seq}`}
                                component={comp}
                                agGridIndex={index}
                                onRowClicked={handleRowClicked}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default DeskingListContainer;
