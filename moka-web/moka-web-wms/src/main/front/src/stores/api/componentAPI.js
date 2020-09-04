import qs from 'qs';
import client from './client';

// 컴포넌트목록 조회
export const getComponents = ({ search }) => {
    const queryString = qs.stringify(search);
    return client.get(`/api/components?${queryString}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 조회
export const getComponent = ({ componentSeq }) => {
    return client.get(`/api/components/${componentSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 저장(RequestBody => 데이터타입 json)
export const postComponent = ({ component }) => {
    const componentSet = {
        ...component,
        dataset: { datasetSeq: component.datasetSeq },
        skin: { skinSeq: component.skinSeq },
        domain: { domainId: component.domainId },
        template: { templateSeq: component.templateSeq }
    };

    return client
        .post('/api/components', componentSet, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 여러개 한번에 저장(RequestBody => 데이터타입 json)
export const postAllComponents = ({ components }) => {
    let realComponents = components.map((c) => ({
        domain: {
            domainId: c.domainId
        },
        template: {
            templateSeq: c.templateSeq
        },
        componentName: c.componentName
    }));

    return client
        .post('/api/components/all', realComponents, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 수정(RequestBody => 데이터타입 json)
export const putComponent = ({ component }) => {
    const componentSet = {
        ...component,
        dataset: { datasetSeq: component.datasetSeq },
        skin: { skinSeq: component.skinSeq },
        domain: { domainId: component.domainId },
        template: { templateSeq: component.templateSeq }
    };

    return client
        .put(`/api/components/${component.componentSeq}`, componentSet, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 복사(componentName만 requestparam으로 받음)
export const copyComponent = ({ componentSeq, componentName }) => {
    const qus = qs.stringify({ componentName });
    return client.post(`/api/components/${componentSeq}/copy?${qus}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 삭제
export const deleteComponent = ({ componentSeq }) => {
    return client.delete(`/api/components/${componentSeq}`).catch((err) => {
        throw err;
    });
};

// 히스토리 목록 조회
export const getHistories = ({ search }) => {
    const queryString = qs.stringify(search);
    return client
        .get(`/api/components/${search.componentSeq}/histories?${queryString}`)
        .catch((err) => {
            throw err;
        });
};

// 데이터API 조회 -> TPS로 호출
export const getData = ({ search }) => {
    return client.get(`/api/components/dataApi?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 확인
export const hasRelations = ({ componentSeq }) => {
    return client.get(`/api/components/${componentSeq}/hasRelations`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 조회
export const getRelations = ({ search }) => {
    const queryString = qs.stringify(search);
    return client
        .get(`/api/components/${search.componentSeq}/relations?${queryString}`)
        .catch((err) => {
            throw err;
        });
};
