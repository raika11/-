import React, { useEffect,  useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WmsSelect from '~/components/WmsSelects';
import { WmsTextFieldIcon } from '~/components/WmsTextFields';
import { defaultSearch, getReservedList } from '~/stores/reserved/reservedStore';
import style from '~/assets/jss/pages/Reserved/ReservedSearchStyle';

const useStyle = makeStyles(style);

const defaultSearchType = [
    { id: 'reservedId', name: '코드' },
    { id: 'reservedValue', name: '값' }
];

const ReservedSearchContainer = ({ history }) => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const domains = useSelector((store) => store.authStore.domains);
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const [search, ] = useState(defaultSearch);
    const [domainRows, setDomainRows] = useState([]);
    const keywordRef = useRef();

    const [keyWord, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('reservedId');
    const [, setSelectedDomain] = useState(search.domainId);

    // apiCodeId정보 변경 : 즉시조회

    useEffect(() => {
        const option = {
            ...search,
            domainId: latestDomainId
        };
        dispatch(getReservedList(option));
    }, [dispatch, latestDomainId, search]);

    // 검색버튼 클릭
    const onSearch = (e) => {
        const option = {
            ...search,
            searchType,
            domainId: latestDomainId,
            keyword: keyWord
        };
        dispatch(getReservedList(option));
    };

    useEffect(() => {
        if (domains) {
            const rows1 = domains.map((m) => {
                return {
                    id: m.domainId,
                    name: m.domainName
                };
            });
            setDomainRows(rows1);
        }
    }, [domains]);

    const handleChangeSearchOption = (e) => {
        if (e.target.name === 'selectedDomain') {
            setSelectedDomain(e.target.value);
        } else if (e.target.name === 'searchType') {
            setSearchType(e.target.value);
        } else if (e.target.name === 'keyword') {
            setKeyword(e.target.value);
        }
    };

    return (
        <div className={clsx(classes.root, classes.mb8)}>
            <>
                <WmsSelect
                    rows={domainRows}
                    currentId={search.domainId}
                    width="100%"
                    overrideClassName={clsx(classes.mb8, classes.mr8)}
                    name="selectedDomain"
                    onChange={handleChangeSearchOption}
                />
            </>
            <>
                <WmsSelect
                    rows={defaultSearchType}
                    currentId={search.searchType}
                    width={166}
                    overrideClassName={classes.mr8}
                    name="searchType"
                    onChange={handleChangeSearchOption}
                />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요."
                    value={keyWord}
                    width="calc(100% - 174px)"
                    icon="search"
                    name="keyword"
                    onChange={handleChangeSearchOption}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                    inputRef={keywordRef}
                />
            </>
        </div>
    );
};

export default withRouter(ReservedSearchContainer);
