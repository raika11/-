import qs from 'qs';
import instance from '@store/commons/axios';

// 컴포넌트 목록 조회
export const getComponentList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/components?${queryString}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 조회
export const getComponent = ({ componentSeq }) => {
    return instance.get(`/api/components/${componentSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 저장(application/json)
export const postComponent = ({ component }) => {
    return instance
        .post('/api/components', component, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 여러개 한번에 저장(application/json)
export const postAllComponents = ({ componentList }) => {
    let saveTarget = componentList.map((component) => ({
        domain: { domainId: component.domainId },
        template: { templateSeq: component.templateSeq },
        componentName: component.componentName,
    }));

    return instance
        .post('/api/components/all', saveTarget, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 수정(application/json)
export const putComponent = ({ component }) => {
    return instance
        .put(`/api/components/${component.componentSeq}`, component, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 복사
export const copyComponent = ({ componentSeq, componentName }) => {
    const queryString = qs.stringify({ componentName });
    return instance.post(`/api/components/${componentSeq}/copy?${queryString}`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 확인
export const hasRelationList = ({ componentSeq }) => {
    return instance.get(`/api/components/${componentSeq}/has-relations`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 히스토리 조회
export const getHistoryList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/components/${search.componentSeq}/histories?${queryString}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 삭제
export const deleteComponent = ({ componentSeq }) => {
    return instance.delete(`/api/components/${componentSeq}`).catch((err) => {
        throw err;
    });
};
