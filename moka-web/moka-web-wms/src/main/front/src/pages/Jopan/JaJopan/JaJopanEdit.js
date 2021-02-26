import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import instance from '@store/commons/axios';
import { MokaCard } from '@/components';
import { API_BASE_URL } from '@/constants';
import { initialState } from '@/store/rcvArticle';

const JaJopanEdit = () => {
    const jopan = useSelector(({ rcvArticle }) => rcvArticle);
    const [temp, setTemp] = useState(initialState.rcvArticle.jopan);
    const [sourceCode, setSourceCode] = useState('1');
    const [ho, setHo] = useState(17148);
    const [pressDate, setPressDate] = useState('2020-09-04%2000:00:00');
    const [myun, setMyun] = useState('01');
    const [section, setSection] = useState('D1001');
    const [revision, setRevision] = useState('01');

    const iframeRef = useRef(null);

    useEffect(() => {
        // 조판 정보 셋팅
        setTemp({
            ...jopan,
            sourceCode: jopan.id?.sourceCode || '',
            ho: jopan.id?.ho || '',
            myun: jopan.id?.myun || '',
            section: jopan.id?.section || '',
            revision: jopan.id?.revision || '',
            pressDate: jopan.pressDate ? moment(jopan.pressDate).format('YYYY-MM-DD') : '',
        });
    }, [jopan]);

    useEffect(() => {
        instance.get(`jopan?sourceCode=${sourceCode}&ho=${ho}&pressDate=${pressDate}&myun=${myun}&section=${section}&revision=${revision}`).then(function (response) {
            if (response.data) {
                if (!iframeRef.current) return;
                let doc = iframeRef.current.contentDocument;
                if (!doc) {
                    iframeRef.current.src = 'about:blank';
                    iframeRef.current.onload = function () {
                        doc = iframeRef.current.contentDocument;
                        doc.open();
                        doc.write(response.data || '');
                        doc.close();
                        iframeRef.current.onload = null;
                    };
                } else {
                    doc.open();
                    doc.write(response.data || '');
                    doc.close();
                }
            }
        });
    }, [ho, myun, pressDate, revision, section, sourceCode]);

    // useEffect(() => {
    //     if (!iframeRef.current) return;
    //     let doc = iframeRef.current.contentDocument;
    //     if (!doc) {
    //         iframeRef.current.src = 'about:blank';
    //         iframeRef.current.onload = function () {
    //             doc = iframeRef.current.contentDocument;
    //             doc.open();
    //             doc.write(previewContent || '');
    //             doc.close();
    //             iframeRef.current.onload = null;
    //         };
    //     } else {
    //         doc.open();
    //         doc.write(temp?.xmlBody ? temp.xmlBody : '');
    //         doc.close();
    //     }
    // }, []);

    return (
        <MokaCard className="w-100" bodyClassName="overflow-hidden" header={false}>
            <iframe
                ref={iframeRef}
                className="w-100 h-100"
                // src={`${API_BASE_URL}/jopan?sourceCode=${sourceCode}&ho=${ho}&pressDate=${pressDate}&myun=${myun}&section=${section}&revision=${revision}`}
                title="미리보기"
                frameBorder="0"
            />
        </MokaCard>
    );
};

export default JaJopanEdit;
