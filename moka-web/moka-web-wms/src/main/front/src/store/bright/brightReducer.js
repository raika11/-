import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        searchType: 'name',
        keyword: '',
    },
    ovp: {},
    ovpError: null,
    invalidList: [],
};
