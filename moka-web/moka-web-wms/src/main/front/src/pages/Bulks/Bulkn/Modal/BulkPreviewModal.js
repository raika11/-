import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import { MokaModal, MokaCardTabs, MokaInput } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { hidePreviewModal, getCopyright } from '@store/bulks';

const propTypes = {
    control: PropTypes.object,
};
const defaultProps = {};

/**
 * 데이터셋 리스트 공통 모달
 */
const BulkPreviewModal = () => {
    const dispatch = useDispatch();
    const { previewModal, copyright } = useSelector((store) => ({
        previewModal: store.bulks.bulkn.previewModal,
        copyright: store.bulks.bulkn.copyright,
    }));

    // 모달 상태 스테이트
    const [mokaModalShow, setMokaModalShow] = useState(false);

    // 미리보기 창에서 보여줄 html
    const [htmlString, setHtmlString] = useState(``);

    // 미리보기 창에서 보여줄 xml
    const [xmlString, setXmlString] = useState(``);

    // 미리보기 텝
    const [tabNavs] = useState(['미리보기', '소스보기']);
    // 임시.
    const setNavIdx = () => {};

    // 창 닫기 취소 버튼 클릭 처리.
    const hidePreviewModel = () => {
        setMokaModalShow(false);
        dispatch(hidePreviewModal()); // 모달 스토어 초기화.
    };

    /*
    * 링크 css.
    * html 미리보기에서 공통 css 가 먹혀서 테스트 했던 css 입니다.
        a, a:hover, a:focus, a:active {
            text-decoration: none;
            color: inherit;
        }
    */

    useEffect(() => {
        const initPrivewString = (bulkArticle) => {
            // 미리 보기 창에 보여줄 html 처리.
            const tempHtmlString = `
            ${bulkArticle
                .filter((e) => e.url.length > 0)
                .map(function (e) {
                    return `▶ <a href="${e.url}" target="_joins_nw">${e.title}</a>`;
                })
                .join(`<br >`)}<br><br>${copyright.cdNm}
            `;

            // 미리 보기 창에 보여줄 xml 처리.
            const tempXmlString = `<copyright><![CDATA[${bulkArticle
                .filter((e) => e.url.length > 0)
                .map(function (e) {
                    return `▶️ <a href="${e.url}" target="_joins_nw">${e.title}</a>`;
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

    // store 에 모달 창 상태 변경 되면 모달창 상태 변경.
    useEffect(() => {
        if (previewModal.state === true) {
            setMokaModalShow(true);
        }
    }, [previewModal.state]);

    // 모달창 copyright 가져오기.
    useEffect(() => {
        dispatch(getCopyright());
    }, [dispatch]);

    // 혹시 몰라서 정리 함수도 추가.
    useEffect(() => {
        return () => {
            dispatch(hidePreviewModal());
        };
    }, [dispatch]);

    // 텝 생성.
    const createTabs = () => {
        return tabNavs.map((nav) => {
            if (nav === '미리보기') {
                return (
                    <Col xs={12} className="pt-4">
                        <div className="text-justify" dangerouslySetInnerHTML={{ __html: htmlString }} />
                    </Col>
                );
            } else if (nav === '소스보기') {
                return (
                    <Col xs={12} className="pt-4">
                        <MokaInput as={'textarea'} className="resize-none" value={xmlString} inputProps={{ plaintext: true, readOnly: true, rows: '6' }} />
                    </Col>
                );
            }
            return <></>;
        });
    };

    return (
        <MokaModal
            show={mokaModalShow}
            onHide={hidePreviewModel}
            title="네이버 벌크 문구 미리보기"
            size="md"
            width={700}
            height={450}
            draggable
            buttons={[{ text: '취소', variant: 'negative', onClick: hidePreviewModel }]}
        >
            <MokaCardTabs
                width={840}
                className="w-100"
                onSelectNav={(idx) => setNavIdx(idx)}
                fill
                tabs={createTabs()}
                tabNavs={tabNavs}
                height={250}
                activeKey={previewModal.activeKey}
            />
        </MokaModal>
    );
};

BulkPreviewModal.propTypes = propTypes;
BulkPreviewModal.defaultProps = defaultProps;

export default BulkPreviewModal;
