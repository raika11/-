import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import { params } from './ApisAgGridColumns';
import { MokaCard, MokaIcon, MokaInput, MokaInputLabel } from '@/components';
import ParamsRenderer from './components/ParamsRenderer';
import toast from '@/utils/toastUtil';

/**
 * API 정보
 */
const ApisEdit = (props) => {
    // const { match } = props;
    const { seqNo } = useParams();
    const [api, setApi] = useState({
        usedYn: 'Y',
        apiName: '',
        route: '',
        method: '',
        desc: '',
        param: {
            name: '',
            desc: '',
            paramYn: 'N',
            dataType: 'string',
        },
    });
    // const [param, setParam] = useState({
    //     name: '',
    //     desc: '',
    //     paramYn: 'N',
    //     dataType: 'string',
    // });
    const paramArr = [
        {
            name: '',
            desc: '',
            paramYn: 'N',
            dataType: 'string',
        },
    ];

    const handleChangeValue = useCallback(
        (e) => {
            const { name, value, checked } = e.target;

            if (name === 'usedYn') {
                setApi({ ...api, usedYn: checked ? 'Y' : 'N' });
            } else if (name === 'paramName') {
                setApi({ ...api, param: { ...api.param, name: value } });
            } else if (name === 'paramDesc') {
                setApi({ ...api, param: { ...api.param, desc: value } });
            } else if (name === 'paramYn') {
                setApi({ ...api, param: { ...api.param, paramYn: value } });
            } else if (name === 'dataType') {
                setApi({ ...api, param: { ...api.param, dataType: value } });
            } else {
                setApi({ ...api, [name]: value });
            }
        },
        [api],
    );

    const handleClickAddParam = useCallback(() => {
        if (api.param.name && api.param.desc) {
            paramArr.push({ name: api.param.name, desc: api.param.desc, paramYn: api.param.paramYn, dataType: api.param.dataType });
        } else {
            toast.warning('파라미터명 또는 파라미터 설명을 입력하세요.');
        }
    }, [api.param.dataType, api.param.desc, api.param.name, api.param.paramYn, paramArr]);

    const handleClickDeleteParam = () => {};

    // useEffect(() => {
    //     if (paramArr.length > 0) {
    //     }
    // }, [paramArr.length]);

    return (
        <MokaCard
            title={seqNo ? 'API 정보 수정' : 'API 정보 등록'}
            width={768}
            footerClassName="justify-content-center"
            footer
            footerButtons={
                seqNo
                    ? [
                          { text: '수정', variant: 'positive', className: 'mr-2' },
                          { text: '취소', variant: 'negative', className: 'mr-2' },
                          { text: '삭제', variant: 'negative' },
                      ]
                    : [
                          { text: '등록', variant: 'positive', className: 'mr-2' },
                          { text: '취소', variant: 'negative' },
                      ]
            }
        >
            <Form>
                <MokaInputLabel
                    label="사용여부"
                    as="switch"
                    className="mb-2"
                    name="usedYn"
                    id="apis-used-yn"
                    inputProps={{ custom: true, checked: api.usedYn === 'Y' }}
                    onChange={handleChangeValue}
                />
                <div style={{ width: 300 }}>
                    <MokaInputLabel label="API명" className="mb-2" name="apiName" value={api.apiName} onChange={handleChangeValue} required />
                </div>
                <div style={{ width: 300 }}>
                    <MokaInputLabel label="API 경로" className="mb-2" name="route" value={api.route} onChange={handleChangeValue} required />
                </div>
                <div style={{ width: 250 }}>
                    <MokaInputLabel label="API 방식" as="select" className="mb-2" name="method" value={api.method} onChange={handleChangeValue}>
                        <option value="get">GET</option>
                        <option value="post">POST</option>
                        <option value="delete">DELETE</option>
                        <option value="put">PUT</option>
                    </MokaInputLabel>
                </div>
                <MokaInputLabel
                    label="API 설명"
                    as="textarea"
                    className="mb-2"
                    inputClassName="resize-none"
                    name="desc"
                    inputProps={{ rows: 6 }}
                    value={api.desc}
                    onChange={handleChangeValue}
                />
                <div className="mb-4 d-flex align-items-center">
                    <MokaInputLabel label="파라미터" className="mr-2" placeholder="파라미터명" name="paramName" value={api.param.name} onChange={handleChangeValue} />
                    <MokaInput placeholder="파라미터 설명" className="mr-2" style={{ width: 350 }} name="paramDesc" value={api.param.desc} onChange={handleChangeValue} />
                    <MokaInput as="select" className="mr-2" style={{ width: 80 }} name="paramYn" value={api.param.paramYn} onChange={handleChangeValue}>
                        <option value="N">선택</option>
                        <option value="Y">필수</option>
                    </MokaInput>
                    <MokaInput as="select" className="mr-2" style={{ width: 150 }} name="dataType" value={api.param.dataType} onChange={handleChangeValue}>
                        <option value="string">String</option>
                        <option value="integer">Integer</option>
                        <option value="long">Long</option>
                        <option value="arrayString">Array[string]</option>
                        <option value="dateTime">Date-time</option>
                        <option value="file">File</option>
                    </MokaInput>
                    <div className="h-100 d-flex align-items-center justify-content-center">
                        <OverlayTrigger overlay={<Tooltip id="tooltip-api-edit">파라미터 추가</Tooltip>}>
                            <Button variant="white" className="border p-0 moka-table-button" onClick={handleClickAddParam}>
                                <MokaIcon iconName="fal-plus" />
                            </Button>
                        </OverlayTrigger>
                    </div>
                </div>
                <ParamsRenderer params={seqNo ? params : paramArr} onClick={handleClickDeleteParam} />
            </Form>
        </MokaCard>
    );
};

export default ApisEdit;
