import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import produce from 'immer';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
// import { params } from './ApisAgGridColumns';
import { MokaCard, MokaIcon, MokaInput, MokaInputLabel } from '@/components';
import toast from '@/utils/toastUtil';

/**
 * API 정보
 */
const ApisEdit = (props) => {
    // const { match } = props;
    const history = useHistory();
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
    const [paramList, setParamList] = useState([]);

    /**
     * 파라미터 필드 셋팅
     */
    const resetParamList = useCallback(() => {
        setParamList([
            {
                name: '',
                desc: '',
                paramYn: 'N',
                dataType: 'string',
            },
        ]);
    }, []);

    /**
     * input 값 변경
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value, checked } = e.target;

            if (name === 'usedYn') {
                setApi({ ...api, usedYn: checked ? 'Y' : 'N' });
            } else {
                setApi({ ...api, [name]: value });
            }
        },
        [api],
    );

    /**
     * 파라미터 값 변경
     * @param {object} e
     * @param {number} 파라미터 object 순서
     */
    const handleParamList = (e, idx) => {
        const { name, value } = e.target;
        setParamList(
            produce(paramList, (draft) => {
                if (name === 'paramName') {
                    draft[idx].name = value;
                } else if (name === 'paramDesc') {
                    draft[idx].desc = value;
                } else if (name === 'paramYn') {
                    draft[idx].paramYn = value;
                } else if (name === 'dataType') {
                    draft[idx].dataType = value;
                }
            }),
        );
    };

    /**
     * 파라미터 추가
     */
    const handleClickAddParam = () => {
        if (paramList[0].name && paramList[0].desc) {
            setParamList(
                produce(paramList, (draft) => {
                    draft.push({
                        name: paramList[0].name,
                        desc: paramList[0].desc,
                        paramYn: paramList[0].paramYn,
                        dataType: paramList[0].dataType,
                    });
                }),
            );
        } else {
            toast.warning('파라미터명과 설명을 입력하세요.');
        }
    };

    // /**
    //  * 파라미터가 추가되면 0번째 paramList 초기화
    //  */
    // const resetParamData = () => {
    //     produce(paramList, (draft) => {
    //         draft[0].name = '';
    //         draft[0].desc = '';
    //         draft[0].paramYn = 'N';
    //         draft[0].dataType = 'string';
    //     });
    // };

    const handleClickDeleteParam = (e, idx) => {
        setParamList(
            produce(paramList, (draft) => {
                draft.splice(idx, 1);
            }),
        );
    };

    const handleClickCancel = () => {
        history.push('/apis');
    };

    useEffect(() => {
        resetParamList();
    }, [resetParamList]);

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
                          { text: '취소', variant: 'negative', className: 'mr-2', onClick: handleClickCancel },
                          { text: '삭제', variant: 'negative' },
                      ]
                    : [
                          { text: '등록', variant: 'positive', className: 'mr-2' },
                          { text: '취소', variant: 'negative', onClick: handleClickCancel },
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

                {paramList.map(({ name, desc, paramYn, dataType }, idx) => (
                    <div className={clsx(idx === 0 ? 'mb-4' : 'mb-2', 'd-flex align-items-center')} key={idx}>
                        {/* <div className={clsx(idx === 0 ? 'mb-4' : 'mb-2', 'd-flex align-items-center')}> */}

                        <MokaInputLabel
                            label={idx === 0 ? '파라미터' : ' '}
                            className="mr-2"
                            placeholder="파라미터명"
                            name="paramName"
                            value={name}
                            onChange={(e) => handleParamList(e, idx)}
                        />
                        <MokaInput placeholder="파라미터 설명" className="mr-2" style={{ width: 350 }} name="paramDesc" value={desc} onChange={(e) => handleParamList(e, idx)} />
                        <MokaInput as="select" className="mr-2" style={{ width: 80 }} name="paramYn" value={paramYn} onChange={(e) => handleParamList(e, idx)}>
                            <option value="N">선택</option>
                            <option value="Y">필수</option>
                        </MokaInput>
                        <MokaInput as="select" className="mr-2" style={{ width: 150 }} name="dataType" value={dataType} onChange={(e) => handleParamList(e, idx)}>
                            <option value="string">String</option>
                            <option value="integer">Integer</option>
                            <option value="long">Long</option>
                            <option value="arrayString">Array[string]</option>
                            <option value="dateTime">Date-time</option>
                            <option value="file">File</option>
                        </MokaInput>
                        <div className="h-100 d-flex align-items-center justify-content-center">
                            {idx === 0 ? (
                                <OverlayTrigger overlay={<Tooltip id="api-tooltip-add">파라미터 추가</Tooltip>}>
                                    <Button variant="outline-neutral" onClick={handleClickAddParam}>
                                        <MokaIcon iconName="fal-plus" />
                                    </Button>
                                </OverlayTrigger>
                            ) : (
                                <OverlayTrigger overlay={<Tooltip id="api-tooltip-delete">파라미터 삭제</Tooltip>}>
                                    <Button variant="outline-neutral" onClick={(e) => handleClickDeleteParam(e, idx)}>
                                        <MokaIcon iconName="fal-minus" />
                                    </Button>
                                </OverlayTrigger>
                            )}
                        </div>
                    </div>
                ))}
            </Form>
        </MokaCard>
    );
};

export default ApisEdit;
