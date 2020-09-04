import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ColumnTwo } from '~/layouts';
import { WmsLoader } from '~/components';

const EtccodeTypeListContainer = React.lazy(() => import('./EtccodeTypeListContainer'));
const EtccodeDetailContainer = React.lazy(() => import('./EtccodeDetailContainer'));

/**
 * EtccodeTypePage
 * @param {object} props Props
 */
const EtccodeTypePage = (props) => {
    const [selectedCodeType, setSelectedCodeType] = useState('');

    return (
        <>
            <Helmet>
                <title>기타코드관리</title>
                <meta name="description" content="기타코드관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            <ColumnTwo {...props} sidebarSize="normal" widthOne="228" widthTwo="1452">
                {/* 코드타입 리스트 */}
                <Suspense fallback={<WmsLoader />}>
                    <EtccodeTypeListContainer setSelectedCodeType={setSelectedCodeType} />
                </Suspense>

                {/* 코드관리 상세 */}
                <Suspense fallback={<WmsLoader />}>
                    <EtccodeDetailContainer selectedCodeType={selectedCodeType} />
                </Suspense>
            </ColumnTwo>
        </>
    );
};

export default EtccodeTypePage;
