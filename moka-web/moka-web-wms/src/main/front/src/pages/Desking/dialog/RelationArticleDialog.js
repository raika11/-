import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsDraggableDialog, WmsButton, WmsTab } from '~/components';
import RelationArticleList from '../article/RelationArticleList';
import RelationArticleEdit from '../article/RelationArticleEdit';
import { agGrids } from '~/utils/agGridUtil';
import {
    putDeskingRelWorks,
    putDeskingWork,
    changeContents,
    openDummyForm
} from '~/stores/desking/deskingStore';
import { getArticle } from '~/stores/article/articleStore';
import style from '~/assets/jss/pages/Desking/DeskingDialogStyle';

const useStyle = makeStyles(style);

/**
 * 관련기사 정보 다이얼로그
 * @param {boolean} props.open 오픈 여부
 * @param {func} props.onClose 클로즈함수
 * @param {func} props.onSave 저장함수
 * @param {object} props.component 선택된 컴포넌트 데이터
 * @param {string} props.contentsId 현재 컨텐츠아이디
 */
const RelationArticleDialog = (props) => {
    const { open, onClose, onSave, component, contentsId } = props;
    const classes = useStyle();
    const dispatch = useDispatch();

    // 데스킹워크, 데스킹관련기사워크 state (초기값, 변하지 않음)
    const [deskingWork, setDeskingWork] = useState({});
    const [deskingRelWorks, setDeskingRelWorks] = useState([]);
    const [loading, setLoading] = useState(false);

    // 데스킹릴레이션워크 업데이트 디스패치함수
    const dispatchDeskingRelWork = (work, relWorks) => {
        dispatch(
            putDeskingRelWorks({
                componentWorkSeq: component.seq,
                deskingWork: work,
                deskingRelWorks: relWorks,
                success: () => {
                    dispatch(
                        changeContents({
                            contentsId: work.contentsId
                        })
                    );

                    // 저장 후 콜백
                    if (typeof onSave === 'function') {
                        onSave({
                            deskingWork: work,
                            deskingRelWorks: relWorks
                        });
                    }
                    setLoading(false);
                    onClose();
                },
                fail: () => setLoading(false)
            })
        );
    };

    // 저장 버튼
    const onSaveTrigger = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);

        // 대표기사 그리드에서 데스킹워크 데이터 가져옴
        let newDeskingWork = {};
        agGrids.prototype.rgrids.main.api.forEachNode((node) => {
            newDeskingWork = node.data;
        });

        // 관련기사 그리드에서 데스킹릴레이션워크 데이터 가져옴
        let newDeskingRelWorks = [];
        agGrids.prototype.rgrids.rel.api.forEachNode((node, idx) => {
            let tmp = {
                ...node.data,
                deskingSeq: deskingWork.deskingSeq, // 데스킹아이디(필수)
                relOrder: idx + 1,
                contentsId: newDeskingWork.contentsId // 대표기사아이디(필수)
            };
            newDeskingRelWorks.push(tmp);
        });

        /**
         * 새 데스킹워크랑 기존의 데스킹워크랑 비교(contentsId, title)해서 다르면
         * 데스킹워크도 업데이트, 다르지 않으면 릴레이션워크만 업데이트한다
         *
         * 1) 기사조회
         * 2) 기사 데이터를 사용하여 데스킹워크 업데이트
         * 3) 데스킹 릴레이션 워크 업데이트
         */
        if (
            newDeskingWork.contentsId !== deskingWork.contentsId ||
            newDeskingWork.title !== deskingWork.title
        ) {
            dispatch(
                getArticle({
                    contentsId: newDeskingWork.contentsId,
                    success: (article) => {
                        // 기사 데이터로 newDeskingWork 값 채움
                        newDeskingWork.thumbnailFileName = article.thumbnailFileName;
                        newDeskingWork.bodyHead = article.contentsText;
                        newDeskingWork.distYmdt = article.distYmdt;
                        newDeskingWork.contentsAttr = 'A';
                        newDeskingWork.subtitle = article.subtitle;
                        newDeskingWork.mobileTitle = '';

                        dispatch(
                            putDeskingWork({
                                componentWorkSeq: component.seq,
                                deskingWork: newDeskingWork,
                                articleChange: 'Y',
                                success: (work) => {
                                    dispatchDeskingRelWork(newDeskingWork, newDeskingRelWorks);
                                },
                                fail: () => setLoading(false)
                            })
                        );
                    }
                })
            );
        } else {
            dispatchDeskingRelWork(newDeskingWork, newDeskingRelWorks);
        }

        dispatch(openDummyForm(false));
    };

    useEffect(() => {
        if (component !== null) {
            if (component.deskingWorks) {
                let tmpm = component.deskingWorks.find((c) => c.contentsId === contentsId);
                setDeskingWork(tmpm);
            }
            if (component.deskingRelWorks) {
                let tmpr = component.deskingRelWorks.filter((c) => c.contentsId === contentsId);
                setDeskingRelWorks(tmpr);
            }
        }
    }, [component, contentsId]);

    return (
        <WmsDraggableDialog
            open={open}
            onClose={onClose}
            title="관련기사 정보"
            maxWidth="xl"
            height={771}
            loading={loading}
            content={
                <div className={classes.relationDialogBody}>
                    {/* 관련기사탭 */}
                    <div className={classes.relationLeftDiv}>
                        <WmsTab
                            tab={[
                                {
                                    label: '기사',
                                    content: (
                                        <RelationArticleList
                                            component={component}
                                            contentsId={contentsId}
                                            deskingWork={deskingWork}
                                            deskingRelWorks={deskingRelWorks}
                                        />
                                    )
                                },
                                { label: '보관함', content: '보관함 컨텐츠' }
                            ]}
                            tabWidth={116}
                            overrideRootClassName={classes.h100}
                            swipeable={false}
                        />
                    </div>
                    {/* 대표기사 / 관련기사 수정 */}
                    <div className={classes.relationRightDiv}>
                        <RelationArticleEdit
                            deskingWork={deskingWork}
                            deskingRelWorks={deskingRelWorks}
                        />
                        <div className={classes.footerBtn}>
                            <WmsButton color="info" size="long" onClick={onSaveTrigger}>
                                저장
                            </WmsButton>
                            <WmsButton color="wolf" size="long" onClick={onClose}>
                                취소
                            </WmsButton>
                        </div>
                    </div>
                </div>
            }
        />
    );
};
export default RelationArticleDialog;
