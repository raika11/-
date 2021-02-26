import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import toast, { messageBox } from '@/utils/toastUtil';
import { useDispatch } from 'react-redux';
import { changeBulkused, clearBulksArticle, getBulkList } from '@store/bulks';

// grid 서비스 부분 렌더.
const ServiceRenderer = ({ bulkartSeq, usedYn, status }) => {
    const dispatch = useDispatch();

    // switch 를 클릭했을떄 처리.
    // useyn 이 N 이고 상태가 save 상태에만 변경.
    const handleOnchange = (checked) => {
        if (checked === true) {
            if (status === 'save') {
                messageBox.alert('저장 후 서비스 상태를 변경해 주세요.', () => {});
                return;
            }

            messageBox.confirm('벌크 전송 문구가 변경됩니다. 현재 이후 출고되는 기사에 적용됩니다.', () => {
                // 변경 전송 처리.
                handleUsedynCheck();
            });
        }
    };

    // 실제 상태 변경 처리.
    const handleUsedynCheck = () => {
        dispatch(
            changeBulkused({
                bulkartSeq: bulkartSeq,
                callback: ({ header: { success, message }, body: { list } }) => {
                    if (success === true) {
                        // dispatch(clearBulksArticle());
                        dispatch(getBulkList()); // 상태가 변경 되면 리스트를 다시 가시고 오기.
                        toast.success(message);
                    } else {
                        if (list && Array.isArray(list)) {
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    return (
        <>
            <Form>
                <Form.Row>
                    <Col xs={12}>
                        <MokaInputLabel
                            as="switch"
                            name={`usedYn_${bulkartSeq}`}
                            id={`usedYn_${bulkartSeq}`}
                            // variant="positive"
                            // labelWidth={87}
                            // label="사용여부"
                            inputProps={{ checked: usedYn === 'Y' }}
                            onChange={(e) => handleOnchange(e.target.checked)}
                            disabled={usedYn === 'Y' ? true : false}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </>
    );
};

export default ServiceRenderer;
