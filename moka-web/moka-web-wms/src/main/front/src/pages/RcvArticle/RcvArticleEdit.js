import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MokaCard } from '@components';
import { getReporterAllListModal } from '@store/reporter';
import ArticleForm from '@pages/Article/components/ArticleForm';
import RctArticleForm from './components/RcvArticleForm';

const rcv = true;

const RcvArticleEdit = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    // 기자리스트 => 나중에 스토어로 관리
    const [reporterList, setReporterList] = useState(null);

    useEffect(() => {
        dispatch(
            getReporterAllListModal({
                callback: ({ header, body }) => {
                    if (header.success) {
                        setReporterList(
                            body.list.map((reporter) => ({
                                ...reporter,
                                value: reporter.repSeq,
                                label: reporter.repName,
                            })),
                        );
                    } else {
                        setReporterList([]);
                    }
                },
            }),
        );
    }, [dispatch]);

    return (
        <MokaCard
            title={!rcv ? '수신기사' : '등록기사'}
            className="flex-fill"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-2' },
                { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-2' },
                { variant: 'positive', text: '기사등록', className: 'mr-2' },
                { variant: 'negative', text: '취소', onClick: () => history.push('/rcv-article') },
            ]}
        >
            {/* <RctArticleForm reporterList={reporterList} /> */}
            <ArticleForm reporterList={reporterList} inRcv />
        </MokaCard>
    );
};

export default RcvArticleEdit;
