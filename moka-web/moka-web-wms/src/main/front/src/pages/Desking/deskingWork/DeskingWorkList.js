import React from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { MokaInputLabel, MokaLoader } from '@components';
import { GET_COMPONENT_WORK_LIST } from '@store/desking';
import DeskingWorkComponent from './DeskingWorkComponent';

const component = {
    componentSeq: 1,
    componentName: '우측',
    perPageCount: 10,
};

/**
 * 데스킹 편집화면
 */
const DeskingWorkList = () => {
    const { area, list, loading } = useSelector((store) => ({
        area: store.desking.area,
        list: store.desking.list,
        loading: store.loading[GET_COMPONENT_WORK_LIST],
    }));

    const handlePreviewClicked = () => {
        // window.open(
        //     `${API_BASE_URL}/preview/desking/page?pageSeq=${pageSeq}&editionSeq=0`,
        //     '전체미리보기'
        // );
    };

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
    };

    return (
        <Form>
            <Form.Row className="d-flex mb-2 justify-content-between">
                {/* 버튼 */}
                <div style={{ width: 200 }} className="mr-2">
                    <MokaInputLabel
                        label="기사 갯수"
                        labelWidth={70}
                        className="mb-0"
                        inputClassName="ft-12"
                        name="perPageCount"
                        value={component.perPageCount}
                        onChange={handleChangeValue}
                    />
                </div>
                <Button variant="dark" className="ft-12 mr-2" onClick={handlePreviewClicked}>
                    페이지 미리보기
                </Button>
            </Form.Row>
            <Form.Row className="d-flex mb-2">
                <div style={{ width: 420 }} className="mr-2">
                    {/* 로딩 */}
                    {/* {loading && <MokaLoader />} */}
                    {/* 데스킹 컴포넌트 */}
                    {/* {!loading &&
                        list && */}
                    {/* {list.map((component, index) => {
                            return <DeskingComponent key={`${areaSeq}-${component.seq}`} component={component} agGridIndex={index} onRowClicked={handleRowClicked} />;
                        })} */}
                    <DeskingWorkComponent key={`1-1`} component={component} agGridIndex="1" />
                </div>
            </Form.Row>
        </Form>
    );
};

export default DeskingWorkList;
