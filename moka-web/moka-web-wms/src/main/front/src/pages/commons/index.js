import { initialState as pageInitialState } from '@store/page';
import { initialState as componentInitialState } from '@store/component';
import { initialState as templateInitialState } from '@store/template';
import { initialState as datasetInitialState } from '@store/dataset';
import { initialState as containerInitialState } from '@store/container';
import { initialState as historyInitialState } from '@store/history';
import { initialState as articleInitialState } from '@store/article';

// 검색조건
export const { searchTypeList: defaultPageSearchType } = pageInitialState;
export const { searchTypeList: defaultComponentSearchType } = componentInitialState;
export const { searchTypeList: defaultTemplateSearchType } = templateInitialState;
export const { searchTypeList: defaultDatasetSearchType } = datasetInitialState;
export const { searchTypeList: defaultContainerSearchType } = containerInitialState;
export const { searchTypeList: defaultHistorySearchType } = historyInitialState;
export const { searchTypeList: defaultArticleSearchType } = articleInitialState;

// 공통 모달
export { default as DefaultInputModal } from './DefaultInputModal';

// 관련 아이템 (하위 => 상위)
export const relationHeight = 633;
export const relationDSHeight = 594;

// Lookup 아이템 (상위 => 하위)
export const LookupPGHeight = 633;
export const LookupCTHeight = LookupPGHeight;
export const LookupHeight = 592;
export const LookupCPHeight = 553;
export const LookupTPHeight = 551;

// 우측 히스토리 리스트
export { default as HistoryList } from './HistoryList';

// 기사코드 Autocomplete
export { default as CodeAutocomplete } from './CodeAutocomplete';
export { default as CodeListModal } from './CodeListModal';

// 매체 selector
export { default as SourceSelector } from './SourceSelector';
