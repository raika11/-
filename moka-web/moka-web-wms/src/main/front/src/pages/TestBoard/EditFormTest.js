import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import instance from '@store/commons/axios';
import { useDispatch } from 'react-redux';
import EditForm from '@/components/EditForm';

const EditFormTestPage = () => {
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        instance.get(`/api/edit-forms/v3_newsletter`).then((res) => {
            initEditForm(res.data.body);
        });
    }, []);

    const initEditForm = (result) => {
        setEditForm(result);
    };

    return (
        <Container>
            <EditForm formData={editForm}></EditForm>
        </Container>
    );
};

export default EditFormTestPage;
