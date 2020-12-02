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
        pageCount: PAGESIZE_OPTIONS[0],
        startdate: null,
        finishdate: null,
        searchKey: '',
        searchValue: '',
        imageType: '',
    },
};
