import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MokaModal, MokaCardTabs, MokaInput } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { hidePreviewModal, getCopyright } from '@store/bulks';

const propTypes = {
    control: PropTypes.object,
};
const defaultProps = {};

/**
 * 네이버 벌크 문구 > 미리보기 모달
 */
const BulkPreviewModal = () => {
    const dispatch = useDispatch();
    const { previewModal, copyright } = useSelector(({ bulks }) => bulks.bulkn);
    const [mokaModalShow, setMokaModalShow] = useState(false); // 모달 상태
    const [htmlString, setHtmlString] = useState(''); // 미리보기 창에서 보여줄 html
    const [xmlString, setXmlString] = useState(''); // 미리보기 창에서 보여줄 xml
    const [tabNavs] = useState(['미리보기', '소스보기']);

    /**
     * 닫기
     */
    const handleHide = () => {
        setMokaModalShow(false);
        dispatch(hidePreviewModal());
    };

    /**
     * 탭 생성
     */
    const createTabs = () =>
        tabNavs.map((nav) => {
            if (nav === '미리보기') {
                return (
                    <div className="w-100 h-100">
                        {htmlString.length > 0 &&
                            htmlString.map((e, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="text-left"
                                        dangerouslySetInnerHTML={{ __html: e }}
                                        style={{
                                            width: '100%',
                                            overflow: 'hidden',
                                            whiteSpace: 'normal',
                                            textAlign: 'left',
                                            wordWrap: 'break-word',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '2',
                                            WebkitBoxOrient: 'vertical',
                                            padding: '0px 0px 3px 0',
                                        }}
                                    />
                                );
                            })}
                        <div style={{ padding: '8px 0px 5px 0px' }}>{copyright.cdNm}</div>
                    </div>
                );
            } else if (nav === '소스보기') {
                return <MokaInput as="textarea" className="h-100 w-100" value={xmlString} inputProps={{ plaintext: true, readOnly: true }} />;
            }
            return null;
        });

    useEffect(() => {
        const initPrivewString = (bulkArticle) => {
            // 미리 보기 창에 보여줄 html 처리.
            // const tempHtmlString = `
            // ${bulkArticle
            //     .filter((e) => e.url.length > 0)
            //     .map(function (e) {
            //         // eslint-disable-next-line prettier/prettier
            //         return `${e.symbol.replace(/^\s+|\s+$/g, '')}&nbsp; &nbsp;<a href="${e.url}" target="_joins_nw">${e.title}</a>`;
            //     })
            //     .join(`<br />`)}<br/><br/>
            //     `;

            // 미리 보기 창에 보여줄 html 처리.
            // console.log(bulkArticle);
            // return;
            const tempHtmlString = bulkArticle
                .filter((e) => e.url.length > 0)
                .map((e) => {
                    return `${e.symbol ? e.symbol.replace(/^\s+|\s+$/g, '') : ''}&nbsp; &nbsp;<a href="${e.url}" target="_joins_nw">${e.title}</a>`;
                });

            // 미리 보기 창에 보여줄 xml 처리.
            const tempXmlString = `<copyright><![CDATA[${bulkArticle
                .filter((e) => e.url.length > 0)
                .map(function (e) {
                    return `${e.symbol} <a href="${e.url}" target="_joins_nw">${e.title}</a>`;
                })
                .join(``)}${copyright.cdNm}]]></copyright>`;

            // 스테이트 변경.
            setHtmlString(tempHtmlString);
            setXmlString(tempXmlString);
        };

        // 모달 상태가 변경 되면 미리보기 창에 보여줄 html xml 값 설정.
        if (mokaModalShow === true && previewModal.bulkArticle.length > 0) {
            initPrivewString(previewModal.bulkArticle);
        }
    }, [copyright, mokaModalShow, previewModal.bulkArticle]);

    useEffect(() => {
        // store 에 모달 창 상태 변경 되면 모달창 상태 변경
        if (previewModal.state) {
            setMokaModalShow(true);
        }
    }, [previewModal.state]);

    useEffect(() => {
        // 모달창 copyright 가져오기
        dispatch(getCopyright());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(hidePreviewModal());
        };
    }, [dispatch]);

    return (
        <MokaModal
            show={mokaModalShow}
            onHide={handleHide}
            title="네이버 벌크 문구 미리보기"
            bodyClassName="p-0"
            headerClassName="pb-0"
            size="md"
            width={600}
            height={450}
            buttons={[{ text: '취소', variant: 'negative', onClick: handleHide }]}
            centered
        >
            <MokaCardTabs className="w-100 h-100 shadow-none" fill tabs={createTabs()} tabNavs={tabNavs} height={250} activeKey={previewModal.activeKey} />
        </MokaModal>
    );
};

BulkPreviewModal.propTypes = propTypes;
BulkPreviewModal.defaultProps = defaultProps;

export default BulkPreviewModal;
