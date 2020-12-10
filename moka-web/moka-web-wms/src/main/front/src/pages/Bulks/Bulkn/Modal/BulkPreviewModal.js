import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import { MokaModal, MokaCardTabs } from '@components';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { hidePreviewModal, getCopyright } from '@store/bulks';

// 미리보기 창에 css 가 없기 때문에 링크 타이틀에 색이 보여서 미리보기 창에만 사용할 css 를 추가 했습니다.
// 공통 css 를 수정 해야 하고 모달 창에만 사용할 꺼라서 css 를 추가 했습니다.
// 이방법이 안좋으면 공통 css 에 추가해 주세요.
// import './BulkPreviewModal.css';

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
        previewModal: store.bulks.previewModal,
        copyright: store.bulks.copyright,
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

    // 모달 상태가 true 로 변경되면 store 에 bulkarticle 를 가지고와서 상태 변경 처리.

    /*
    * 링크 css.
    a, a:hover, a:focus, a:active {
        text-decoration: none;
        color: inherit;
    }
    */

    useEffect(() => {
        const initPrivewString = (bulkArticle) => {
            // 미리 보기 창에 보여줄 html 파싱 처리.
            const tempHtmlString = `
            ${bulkArticle
                .filter((e) => e.url.length > 0)
                .map(function (e) {
                    return `▶ <a href="${e.url}" target="_joins_nw">${e.title}</a>`;
                })
                .join(`<br >`)}<br><br>
                ${copyright.cdNm}
            `;

            // 미리 보기 창에 보여줄 xml 파싱 처리.
            const tempXmlString = `
            <copyright>
            <![CDATA[
                ${bulkArticle
                    .filter((e) => e.url.length > 0)
                    .map(function (e) {
                        return `▶️ <a href="${e.url}" target="_joins_nw">${e.title}</a>`;
                    })
                    .join(``)}
                <br/>
                ${copyright.cdNm}
            ]]>
            </copyright>
            `;

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
                    <Col xs={12} className=" w-100 pt-4 d-sm-inline">
                        <>
                            <div>{xmlString}</div>
                        </>
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
            size="xl"
            footerClassName="justify-content-center"
            width={700}
            height={350}
            draggable
        >
            <MokaCardTabs width={840} className="w-100" onSelectNav={(idx) => setNavIdx(idx)} fill tabs={createTabs()} tabNavs={tabNavs} height={180} />
            <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
                <div className="d-flex justify-content-center">
                    <Button variant="negative" className="mr-05" onClick={hidePreviewModel}>
                        취소
                    </Button>
                </div>
            </div>
        </MokaModal>
    );
};

BulkPreviewModal.propTypes = propTypes;
BulkPreviewModal.defaultProps = defaultProps;

export default BulkPreviewModal;
