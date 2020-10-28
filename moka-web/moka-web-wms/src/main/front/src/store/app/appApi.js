import instance from '../commons/axios';

export const appInit = () => {
    return instance.get('/api/app/init');
};
