import React from 'react';
import clsx from 'clsx';

const LoginNameRenderer = ({ data }) => {
    return (
        <div className="h-100 w-100 text-truncate text-wrap py-1">
            <span
                className={clsx('icon', {
                    i_kk: data.loginSns === 'K',
                    i_js: data.loginSns === 'J',
                    i_tw: data.loginSns === 'T',
                    i_na: data.loginSns === 'N',
                    i_fb: data.loginSns === 'F',
                })}
            >
                {data.loginName}
            </span>
        </div>
    );
};

export default LoginNameRenderer;
