import React from 'react';
import { MokaPagination } from '@components';
import EditThumbCard from './EditThumbCard';

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const EditThumbTable = (props) => {
    return (
        <React.Fragment>
            <div className="border w-100 custom-scroll overflow-y-scroll mb-2" style={{ height: 364 }}>
                <div className="d-flex flex-wrap align-content-start p-1 overflow-hidden">
                    {[...Array(20)].map((x, idx) => (
                        <EditThumbCard key={idx} data={{ name: `${idx}-테스트`, id: idx, index: idx, color: getRandomColor() }} />
                    ))}
                </div>
            </div>
            <MokaPagination page={0} total={0} size={20} />
        </React.Fragment>
    );
};

export default EditThumbTable;
