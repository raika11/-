import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaCard } from '@components';
// import ArticleForm from '@pages/Article/components/ArticleForm';
import RctArticleForm from './components/RcvArticleForm';

const RcvArticleEdit = () => {
    const history = useHistory();
    const [reporterList, setReporterList] = useState([]);

    return (
        <MokaCard
            title="수신기사"
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
            <RctArticleForm reporterList={reporterList} />
        </MokaCard>
    );
};

export default RcvArticleEdit;
