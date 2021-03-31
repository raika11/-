import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import toast, { messageBox } from '@utils/toastUtil';
import { MokaInputLabel, MokaCard } from '@components';
import { initialState, saveArea, DELETE_AREA, SAVE_AREA } from '@store/area';

/**
 * 편집영역 1뎁스 등록/수정
 */
const AreaFormDepth1 = (props) => {
    const { onDelete, area, flag, setFlag, child, listDepth1, sourceCode, setAreaDepth1 } = props;
    const dispatch = useDispatch();
    const domainList = useSelector(({ auth }) => auth.domainList);
    const loading = useSelector(({ loading }) => loading[DELETE_AREA] || loading[SAVE_AREA]);
    const [temp, setTemp] = useState(initialState.initData.area);
    const [domain, setDomain] = useState({});
    const [error, setError] = useState({});

    /**
     * input 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
        } else if (name === 'areaNm') {
            setTemp({ ...temp, areaNm: value });
        } else if (name === 'domainId') {
            const { name, url } = e.target.selectedOptions[0].dataset;
            setDomain({ domainId: e.target.value, domainName: name, domainUrl: url });
            setError({ domainId: false });
        }
    };

    /**
     * 리스트 재로드
     */
    const reloadList = () => setFlag({ ...flag, depth1: new Date().getTime() });

    /**
     * 저장
     * @param {object} save area데이터
     */
    const handleSave = (save) => {
        let as = save;
        as.compYn = 'N';
        delete as.areaComp;
        delete as.areaComps;

        dispatch(
            saveArea({
                area: as,
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        reloadList();
                        setAreaDepth1(body);
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        const save = {
            ...temp,
            ordNo: temp.areaSeq ? temp.ordNo : listDepth1.length + 1, // 수정 등록 분기쳐서 ordNo 셋팅
            sourceCode,
            container: null,
            page: null,
            parent: null,
            areaComps: [],
            domain,
        };

        if (!domain?.domainId) {
            setError({ domainId: true });
            return;
        }

        if (child.length > 0 && save.usedYn === 'N') {
            messageBox.confirm(
                '하위 뎁스 메뉴도 편집 영역에 노출되지 않습니다.\n사용여부를 off 하시겠습니까?',
                () => handleSave(save),
                () => {},
            );
        } else {
            handleSave(save);
        }
    };

    /**
     * 삭제
     */
    const handleClickDelete = () => onDelete(temp, 1);

    useEffect(() => {
        const target = area?.area || {};
        setTemp(target);
        setDomain(target?.domain);
    }, [area]);

    return (
        <MokaCard
            title={`편집영역 ${temp.areaSeq ? '수정' : '등록'}`}
            className="flex-fill"
            loading={loading}
            footer
            footerButtons={[
                { text: temp.areaSeq ? '수정' : '저장', variant: 'positive', className: 'mr-1', onClick: handleClickSave },
                temp.areaSeq && { text: '삭제', variant: 'negative', onClick: handleClickDelete },
            ].filter(Boolean)}
        >
            <div>
                {/* 사용여부 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        className="mb-0"
                        as="switch"
                        label="사용여부"
                        id="usedYn"
                        name="usedYn"
                        inputProps={{ checked: temp.usedYn === 'Y' }}
                        onChange={handleChangeValue}
                    />
                </Form.Row>

                {/* 그룹영역명 */}
                <Form.Row className="mb-2">
                    <Col xs={8} className="p-0 pr-40">
                        <MokaInputLabel
                            className="mb-0"
                            label="그룹 영역명"
                            placeholder="그룹 영역명을 입력하세요"
                            value={temp.areaNm}
                            name="areaNm"
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInputLabel className="mb-0" label="영역코드" value={temp.areaSeq} inputProps={{ readOnly: true }} />
                    </Col>
                </Form.Row>

                {/* 도메인 */}
                <MokaInputLabel
                    className="mb-2"
                    as="select"
                    label="도메인"
                    name="domainId"
                    value={domain.domainId}
                    onChange={handleChangeValue}
                    disabled={temp.areaSeq ? true : false}
                    isInvalid={error.domainId}
                    required
                >
                    <option hidden>도메인을 선택하세요</option>
                    {domainList.map((d) => (
                        <option key={d.domainId} value={d.domainId} data-name={d.domainName} data-url={d.domainUrl}>
                            {d.domainName} ({d.domainUrl})
                        </option>
                    ))}
                </MokaInputLabel>
            </div>
        </MokaCard>
    );
};

export default AreaFormDepth1;
