import React, { useEffect, useState, useRef } from 'react';

import InfoForm from './InfoForm';
import AnswerFrom from './AnswerFrom';

const FormControl = ({ formMode }) => {
    if (formMode === 'new' || formMode === 'modify') {
        return <InfoForm formMode={formMode} />;
    } else if (formMode === 'answer') {
        return <AnswerFrom />;
    }
};

export default FormControl;
