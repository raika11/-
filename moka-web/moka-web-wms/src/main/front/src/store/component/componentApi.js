import qs from 'qs';
import instance from '@store/commons/axios';

// 컴포넌트 여러개 한번에 저장(RequestBody => 데이터타입 json)
export const postAllComponents = ({ componentList }) => {
    let saveTarget = componentList.map((component) => ({
        domain: component,
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
