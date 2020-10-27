import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import instance from '@store/commons/axios';
import { useDispatch } from 'react-redux';
import DynamicForm from '@/components/DynamicForm';

const DynamicFormTestPage = () => {
    const [dynamicForm, setDynamicForm] = useState(null);

    useEffect(() => {
        instance.get(`/api/app/dynamic-form/v3_newsletter`).then((res) => {
            initDynamicForm(res.data.body);
        });
    }, []);

    const initDynamicForm = (result) => {
        setDynamicForm(result);
    };

    return (
        <Container>
            <DynamicForm formData={dynamicForm}></DynamicForm>
        </Container>
    );
};

export default DynamicFormTestPage;
