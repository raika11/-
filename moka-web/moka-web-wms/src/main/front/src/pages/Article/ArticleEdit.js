import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReporterAllList } from '@store/reporter';
import { getArticleType } from '@store/codeMgt';
import { clearArticle, getArticleList } from '@store/article';
import ArticleForm from '@pages/Article/components/ArticleForm';

const ArticleEdit = ({ match }) => {
    const { totalId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const articleTypeRows = useSelector((store) => store.codeMgt.articleTypeRows);
    const allReporter = useSelector((store) => store.reporter.allReporter); // 전체 기자리스트
    const search = useSelector(({ article }) => article.search);
    const [reporterList, setReporterList] = useState([]);

    /**
     * 취소
     */
    const handleCancle = () => {
        history.push(match.path);
        dispatch(clearArticle());
    };

    /**
     * 등록기사 수정 후
     */
    const reloadList = () => dispatch(getArticleList({ search }));

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
            // 등록기사인 경우 동일 기자 비교 => repSeq
            setReporterList(
                allReporter.map((reporter) => ({
                    ...reporter,
                    value: reporter.repSeq,
                    label: reporter.repName,
                })),
            );
        }
    }, [allReporter, dispatch]);

    return (
        <React.Fragment>
            <ArticleForm totalId={totalId} articleTypeRows={articleTypeRows} reporterList={reporterList || []} onCancle={handleCancle} onSave={reloadList} />
        </React.Fragment>
    );
};

export default ArticleEdit;
