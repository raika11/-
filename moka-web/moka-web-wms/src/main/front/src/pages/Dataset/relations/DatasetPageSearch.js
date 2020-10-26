import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaInput } from '@components';
import { GET_RELATION_LIST } from '@store/dataset';

const DatasetPageSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { domainList, dataset, search: storeSearch, total, list, loading } = useSelector((store) => ({
        domainList: store.auth.domainList,
        dataset: store.dataset.dataset,
        search: store.datasetRelationList.PG.search,
        total: store.datasetRelationList.PG.total,
        list: store.datasetRelationList.PG.list,
        loading: store.loading[GET_RELATION_LIST],
    }));

    return (
        <>
            <Form>
                <MokaInput as="select">
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domainId}>
                            {domain.domainName}
                        </option>
                    ))}
                </MokaInput>
            </Form>
            <div className="d-flex justify-content-end mt-2">
                <Button
                    variant="dark"
                    onClick={() => {
                        history.push('/page');
                    }}
                >
                    페이지 추가
                </Button>
            </div>
        </>
    );
};

export default DatasetPageSearch;
