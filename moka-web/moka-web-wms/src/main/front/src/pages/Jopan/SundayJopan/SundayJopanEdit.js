import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import instance from '@store/commons/axios';
import { MokaCard } from '@/components';

/**
 * 수신기사 > 중앙선데이 조판 상세정보
 */
const SundayJopanEdit = () => {
    const [temp, setTemp] = useState({});
    const jopan = useSelector((store) => store.rcvArticle.jopan);

    const [loading, setLoding] = useState(true);
    const iframeRef = useRef(null);

    console.log(temp);
    useEffect(() => {
        // 조판 정보 셋팅
        setTemp({
            ...jopan,
            sourceCode: jopan.id.sourceCode || '',
            ho: jopan.id.ho || '',
            myun: jopan.id.myun || '',
            section: jopan.id.section || '',
            revision: jopan.id.revision || '',
            pressDate: jopan.pressDate ? moment(jopan.pressDate).format('YYYY-MM-DD') : '',
        });
    }, [jopan]);

    useEffect(() => {
        if (temp.sourceCode) {
            instance
                .get(`jopan?sourceCode=${temp.sourceCode}&ho=${temp.ho}&pressDate=${temp.pressDate}&myun=${temp.myun}&section=${temp.section}&revision=${temp.revision}`)
                .then(function (response) {
                    if (response.data) {
                        if (!iframeRef.current) return;
                        let doc = iframeRef.current.contentDocument;
                        if (!doc) {
                            iframeRef.current.src = 'about:blank';
                            iframeRef.current.onload = function () {
                                doc = iframeRef.current.contentDocument;
                                doc.open();
                                doc.write(response.data);
                                doc.close();
                                iframeRef.current.onload = null;
                            };
                        } else {
                            doc.open();
                            doc.write(response.data);
                            doc.close();
                        }
                        setLoding(false);
                    }
                });
        }
    }, [temp]);

    return (
        <MokaCard className="w-100" bodyClassName="overflow-hidden" header={false} loading={loading}>
            <iframe ref={iframeRef} className="w-100 h-100" title="미리보기" frameBorder="0" />
        </MokaCard>
    );
};

export default SundayJopanEdit;
