import React, { useEffect, useState } from 'react';
import produce from 'immer';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import toast from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import { MokaCard, MokaInputLabel } from '@components';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';
import { getPoll, getPollList, updatePoll, GET_POLL, UPDATE_POLL } from '@store/survey/poll/pollAction';
import RelationPollSortAgGridComponent from '@pages/Survey/Poll/components/RelationPollSortAgGridComponent';
import { selectArticleItemChange, selectArticleListChange } from '@store/survey/quiz';
import SortAgGrid from '@pages/Survey/component/SortAgGrid';
import RelationPollModal from '@pages/Survey/Poll/modals/RelationPollModal';

/**
 * 투표관리 > 관련 정보
 */
const PollChildRelation = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [edit, setEdit] = useState({});
    const [isPollModalShow, setIsPollModalShow] = useState(false);
    const [isArticleModalShow, setIsArticleModalShow] = useState(false);
    const [relationPolls, setRelationPolls] = useState([]);
    const [selectPoll, setSelectPoll] = useState(null);
    const [relationArticles, setRelationArticles] = useState([]);
    const [selectArticle, setSelectArticle] = useState(null);

    const { poll, search, codes, loading, item } = useSelector((store) => ({
        poll: store.poll.poll,
        search: store.poll.search,
        codes: store.poll.codes,
        loading: store.loading[GET_POLL] || store.loading[UPDATE_POLL],
        item: store.quiz.selectArticle.item,
    }));

    const handleClickRelationPollAdd = (row) => {
        setSelectPoll(row);
    };

    const handleClickRelationPollDelete = (id) => {
        const polls = relationPolls
            .filter((data) => {
                console.log('data', data);
                console.log('data.ordNo', data.ordNo);
                return data.ordNo !== id;
            })
            .map((pollItems, index) => ({
                ...pollItems,
                ordNo: index + 1,
            }));
        setRelationPolls(polls);
        setEdit(
            produce(edit, (draft) => {
                draft.pollRelateContents = [...polls, ...relationArticles];
            }),
        );
    };

    /*const handleClickArticleModalShow = () => {
        if (commonUtil.isEmpty(edit.pollSeq)) {
            toast.warning('투표 정보를 먼저 등록해 주세요');
        } else {
            setIsArticleModalShow(true);
        }
    };*/

    const handleClickSearch = () => {
        setIsPollModalShow(true);
    };
    const handleClickPollModalClose = () => {
        setIsPollModalShow(false);
    };

    const handleClickRelationArticleAdd = (row) => {
        setSelectArticle(row);
    };

    /*const handleClickRelationArticleDelete = (id) => {
        const articles = relationArticles
            .filter((data) => data.ordNo !== id)
            .map((article, index) => ({
                ...article,
                ordNo: index + 1,
            }));
        setRelationArticles(articles);
        setEdit(
            produce(edit, (draft) => {
                draft.pollRelateContents = [...relationPolls, ...articles];
            }),
        );
    };*/

    const handleChangeSave = () => {
        if (commonUtil.isEmpty(edit.pollSeq)) {
            toast.warning('투표 정보를 먼저 등록해 주세요');
        } else {
            dispatch(
                updatePoll({
                    data: { ...edit, pollRelateContents: [...relationPolls, ...relationArticles] },
                    callback: (response) => {
                        dispatch(getPoll({ pollSeq: response.body.pollSeq }));
                        dispatch(getPollList({ search }));
                        toast.result(response);
                    },
                }),
            );
        }
    };

    useEffect(() => {
        if (selectArticle) {
            const { artTitle: title, totalId } = selectArticle;
            const linkUrl = totalId ? `https://news.joins.com/article/${totalId}` : '';
            const articles = produce(relationArticles, (draft) => {
                draft.push({ title, linkUrl, relType: 'A', pollSeq: poll.pollSeq, contentId: totalId });
            });
            setRelationArticles(articles);
            dispatch(selectArticleListChange(articles));
            dispatch(selectArticleItemChange(articles));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectArticle]);

    useEffect(() => {
        if (selectPoll) {
            if (relationPolls.filter((pollItem) => pollItem.contentId === String(selectPoll.id)).length > 0) {
                toast.warning(`중복된 투표정보(id=${selectPoll.id})가 존재합니다.`);
            } else {
                const polls = [...relationPolls, { title: selectPoll.title, pollSeq: poll.pollSeq, relType: 'P', contentId: selectPoll.id, ordNo: relationPolls.length + 1 }];
                setRelationPolls(polls);
                setEdit(
                    produce(edit, (draft) => {
                        draft.pollRelateContents = [...relationArticles, ...polls];
                    }),
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectPoll]);

    useEffect(() => {
        if (edit.pollRelateContents) {
            setRelationPolls(
                edit.pollRelateContents
                    .filter((data) => data.relType === 'P')
                    .map((article, index) => ({
                        ...article,
                        ordNo: index + 1,
                    })),
            );
            /*const articles = edit.pollRelateContents
                .filter((data) => data.relType === 'A')
                .map((poll, index) => ({
                    ...poll,
                    ordNo: index + 1,
                }));
            setRelationArticles(articles);*/
        } else {
            setRelationPolls([]);
            setRelationArticles([]);
        }
    }, [edit.pollRelateContents]);

    useEffect(() => {
        setEdit(poll);
    }, [poll]);

    useEffect(() => {
        setRelationArticles(item);
    }, [item]);

    return (
        <MokaCard
            title="관련 정보"
            className="w-100"
            footerButtons={[
                { text: '저장', variant: 'positive', onClick: handleChangeSave, className: 'mr-1', useAuth: true },
                { text: '취소', variant: 'negative', onClick: () => history.push('/poll') },
            ]}
            loading={loading}
        >
            <Form>
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="관련 투표" />
                    <Button variant="searching" onClick={handleClickSearch}>
                        투표 검색
                    </Button>
                    <RelationPollModal title="관련 투표 추가" show={isPollModalShow} onHide={handleClickPollModalClose} onAdd={handleClickRelationPollAdd} codes={codes} />
                </Form.Row>

                <RelationPollSortAgGridComponent rows={relationPolls} onChange={setRelationPolls} onDelete={handleClickRelationPollDelete} />

                <hr className="divider" />

                <SortAgGrid />
                <ArticleListModal show={isArticleModalShow} onHide={() => setIsArticleModalShow(false)} onRowClicked={handleClickRelationArticleAdd} />

                {/* <Form.Group>
                <Form.Row>
                    <Col xs={12}>
                        <Form.Group>
                            <Form.Label className="pr-2 mb-0">관련 정보</Form.Label>
                            <Button variant="positive" onClick={handleClickArticleModalShow} className="mr-2">
                                기사 검색
                            </Button>
                            <Button
                                variant="positive"
                                onClick={() => {
                                    handleClickRelationArticleAdd({ title: '', linkUrl: '', totalId: null, ordNo: relationArticles.length + 1 });
                                }}
                            >
                                추가
                            </Button>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form.Group> */}
            </Form>
        </MokaCard>
    );
};

export default PollChildRelation;
