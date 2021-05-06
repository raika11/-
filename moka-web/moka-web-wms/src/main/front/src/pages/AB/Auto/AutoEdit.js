import React, { useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaCardTabs } from '@components';
import { ABMainForm, ABEtcForm, ABStatusRow } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { clearAbTest, getAbtest, saveAbTest, GET_AB_TEST, SAVE_AB_TEST, getAbTestList, closeAbTest, deleteAbTest } from '@store/ab/abAction';
import commonUtil from '@utils/commonUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { ABTEST_TYPE } from '@store/ab/abReducer';

/**
 * A/B 테스트 > 직접 설계 > 등록, 수정
 */
const AutoEdit = ({ match }) => {
    const dispatch = useDispatch();
    const { abTestSeq: abtestSeq } = useParams();
    const history = useHistory();
    const [isAdd, setIsAdd] = useState(true);
    const [isCopy, setIsCopy] = useState(false);
    const [activeKey, setActiveKey] = useState(0);
    const [temp, setTemp] = useState({});
    const data = useSelector(({ ab: store }) => store.ab);
    const loading = useSelector(({ loading }) => loading[GET_AB_TEST] || loading[SAVE_AB_TEST]);
    const search = useSelector(({ ab }) => ab.search);

    useEffect(() => {
        if (!commonUtil.isEmpty(abtestSeq)) {
            dispatch(getAbtest({ abtestSeq }));
            setIsAdd(false);
            setIsCopy(false);
        } else {
            if (!isCopy) {
                dispatch(clearAbTest());
            } else {
                setTemp({ ...temp, abtestSeq: null });
            }
            setIsAdd(true);
        }
    }, [dispatch, abtestSeq]);

    useEffect(() => {
        if (!commonUtil.isEmpty(`${data.abtestSeq}`)) {
            setTemp(data);
        }
    }, [data]);

    const handleClickSaveAbtest = (status) => {
        dispatch(
            saveAbTest({
                detail: { ...temp, status },
                callback: (response) => {
                    const { header, body } = response;
                    toast.result(response);
                    if (header.success) {
                        dispatch(getAbtest({ abtestSeq: body.abtestSeq }));
                        dispatch(getAbTestList({ ...search, abtestType: ABTEST_TYPE.DIRECT_DESIGN }));
                    }
                },
            }),
        );
    };

    const handleClickCloseAbtest = (abtestSeq) => {
        dispatch(
            closeAbTest({
                abtestSeq,
                callback: (response) => {
                    const { header, body } = response;
                    toast.result(response);
                    if (header.success) {
                        dispatch(getAbtest({ abtestSeq }));
                        dispatch(getAbTestList({ ...search, abtestType: ABTEST_TYPE.DIRECT_DESIGN }));
                    }
                },
            }),
        );
    };

    const handleClickDeleteAbtest = (abtestSeq) => {
        dispatch(
            deleteAbTest({
                abtestSeq,
                callback: (response) => {
                    const { header, body } = response;
                    toast.result(response);
                    if (header.success) {
                        history.push('/ab-auto');
                        /*dispatch(getAbtest({ abtestSeq }));
                        dispatch(getAbTestList({ ...search, abtestType: ABTEST_TYPE.DIRECT_DESIGN }));*/
                    }
                },
            }),
        );
    };

    /**
     * 카드 버튼 렌더러
     */
    const renderFooter = () => {
        return isAdd ? (
            <>
                <Button
                    variant="positive"
                    className="mr-1"
                    onClick={() => {
                        handleClickSaveAbtest('Y');
                    }}
                >
                    저장
                </Button>
                <Button
                    variant="temp"
                    className="mr-1"
                    onClick={() => {
                        handleClickSaveAbtest('T');
                    }}
                >
                    임시저장
                </Button>
                <Button variant="negative" onClick={() => history.push(match.path)}>
                    취소
                </Button>
                <Button
                    variant="negative"
                    style={{ marginLeft: 170 }}
                    onClick={() => {
                        if (activeKey === 0) setActiveKey(1);
                        else setActiveKey(0);
                    }}
                >
                    {activeKey === 0 ? '다음' : '이전'}
                </Button>
            </>
        ) : (
            <>
                <Button
                    variant="outline-primary"
                    className="mr-1"
                    onClick={() => {
                        messageBox.alert('미리보기 기능은 준비중 입니다.');
                    }}
                >
                    미리보기
                </Button>
                <Button
                    variant="positive"
                    className="mr-1"
                    onClick={() => {
                        handleClickSaveAbtest('Y');
                    }}
                >
                    수정
                </Button>
                <Button
                    variant="temp"
                    className="mr-1"
                    onClick={() => {
                        handleClickDeleteAbtest(temp.abtestSeq);
                    }}
                >
                    삭제
                </Button>
                <Button variant="negative" onClick={() => history.push(match.path)}>
                    취소
                </Button>
            </>
        );
    };

    /**
     * 탭 nav 렌더러
     */
    const renderTabNavs = useCallback(() => {
        return isAdd ? ['STEP 1\n주요 설정', 'STEP 2\n기타 설정'] : ['주요 설정', '기타 설정'];
    }, [isAdd]);

    /**
     * AB데이터 수정
     * @param {object} 변경될 값들이 담겨져있는 obj
     */
    const handleChange = useCallback(
        (changeTemp) => {
            setTemp(changeTemp);
        },
        [temp],
    );

    const handleChangeObject = (obj) => {
        setTemp({ ...temp, ...obj });
    };

    const handleClickCopy = () => {
        setIsCopy(true);
        history.push('/ab-auto/add');
    };

    return (
        <MokaCard
            title="AB테스트 제목"
            className="w-100"
            headerClassName="pb-0"
            bodyClassName="p-0 m-0"
            footer
            footerClassName={clsx('d-flex align-items-center', {
                'justify-content-end': isAdd,
                'justify-content-center': !isAdd,
            })}
            footerAs={renderFooter()}
            loading={loading}
        >
            <MokaCardTabs
                fill={isAdd}
                activeKey={activeKey}
                onSelectNav={(key) => setActiveKey(key)}
                className="w-100 h-100 shadow-none"
                tabNavs={renderTabNavs()}
                tabs={[
                    <React.Fragment>
                        {!isAdd && (
                            <ABStatusRow
                                status={temp.status}
                                modDt={temp.modDt}
                                modUser={temp.modId}
                                onCopy={handleClickCopy}
                                onCloseAbtest={() => {
                                    handleClickCloseAbtest(temp.abtestSeq);
                                }}
                            />
                        )}
                        <ABMainForm data={temp} onChange={handleChange} />
                    </React.Fragment>,
                    <ABEtcForm data={temp} onChange={handleChangeObject} />,
                ]}
            />
        </MokaCard>
    );
};

export default AutoEdit;
