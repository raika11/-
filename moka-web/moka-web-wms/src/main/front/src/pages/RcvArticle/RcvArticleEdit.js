import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReporterAllList } from '@store/reporter';
import { getArticleType } from '@store/codeMgt';
import { initialState, getRcvArticle, clearRcvArticle, GET_RCV_ARTICLE } from '@store/rcvArticle';
import ArticleForm from '@pages/Article/components/ArticleForm';
import RctArticleForm from './components/RcvArticleForm';
import toast from '@utils/toastUtil';
import { unescapeHtml } from '@utils/convertUtil';

const RcvArticleEdit = () => {
    const { rid } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_RCV_ARTICLE]);
    const rcvArticle = useSelector((store) => store.rcvArticle.rcvArticle);
    const articleTypeRows = useSelector((store) => store.codeMgt.articleTypeRows);
    const allReporter = useSelector((store) => store.reporter.allReporter); // 전체 기자리스트
    const [reporterList, setReporterList] = useState([]);
    const [temp, setTemp] = useState(initialState.rcvArticle);

    /**
     * temp 값 변경
     */
    const handleChangeValue = ({ key, value }) => {
        setTemp({
            ...temp,
            [key]: value,
        });
    };

    /**
     * 취소
     */
    const handleCancle = () => {
        history.push('/rcv-article');
        dispatch(clearRcvArticle());
    };

    useEffect(() => {
        // 기사타입 조회
        if (!articleTypeRows) {
            dispatch(getArticleType());
        }
    }, [articleTypeRows, dispatch]);

    useEffect(() => {
        // 기자 리스트 조회
        if (!allReporter) {
            dispatch(getReporterAllList());
        } else {
            setReporterList(
                allReporter.map((reporter) => ({
                    ...reporter,
                    value: reporter.repSeq,
                    label: reporter.repName,
                })),
            );
        }
    }, [allReporter, dispatch]);

    useEffect(() => {
        // 기사 상세 조회
        if (rid) {
            dispatch(
                getRcvArticle({
                    rid,
                    callback: ({ header }) => {
                        if (!header.success) {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearRcvArticle());
        }
    }, [dispatch, rid]);

    useEffect(() => {
        setTemp({
            ...rcvArticle,
            title: unescapeHtml(rcvArticle.title),
        });
    }, [rcvArticle]);

    return (
        <React.Fragment>
            {rcvArticle.rid && !rcvArticle.totalId && (
                <RctArticleForm
                    article={temp}
                    onChange={handleChangeValue}
                    articleTypeRows={articleTypeRows}
                    reporterList={reporterList || []}
                    loading={loading}
                    onCancle={handleCancle}
                />
            )}
            {rcvArticle.rid && rcvArticle.totalId && (
                <ArticleForm
                    article={temp}
                    onChange={handleChangeValue}
                    articleTypeRows={articleTypeRows}
                    reporterList={reporterList || []}
                    loading={loading}
                    onCancle={handleCancle}
                    inRcv
                />
            )}
        </React.Fragment>
    );
};

export default RcvArticleEdit;
