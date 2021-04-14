/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.web.dps.module.searchEngine;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Description: 검색조건
 *
 * @author ssc
 * @since 2021-04-13
 */
@Getter
@Setter
@Builder
public class SearchCondition {
    private int page;
    private int count;
    private int start;
    private String keyword;
    private Date startSearchDate;
    private Date endSearchDate;
    @Builder.Default
    private SortType sortType = SortType.NEW;
    @Builder.Default
    private SearchCategoryType searchCategoryType = SearchCategoryType.UNIFIED_SEARCH;
    private String matchKeyword;
    private String includeKeyword;
    private String excluedeKeyword;
    @Builder.Default
    private PeriodType periodType = PeriodType.ALL;
    @Builder.Default
    private ScopeType scopeType = ScopeType.TITLE_CONTENT;
    private String serviceCode;
    private String masterCode;
    private String sourceCode;
    private String sourceGroupType;
    private String reporterCode;
    @Builder.Default
    private ImageType imageType = ImageType.ALL;
    @Builder.Default
    private JplusType jplusType = JplusType.ALL;
    @Builder.Default
    private BlogType blogType = BlogType.ALL;
    @Builder.Default
    public ImageSearchType imageSearchType = ImageSearchType.LIST;
    private int totalCount;
    private boolean chosung;
    @Builder.Default
    private IssueCategoryType issueCategoryType = IssueCategoryType.ALL;
    private String detailSearch;
    @Builder.Default
    private boolean duplicate = true;
    private String specialPageCdNo;
    private String specialPageLstYn;

    public Map<String, Object> toParameters() {
        Map<String, Object> parameter = new HashMap<>();

        parameter.put("joongangUse", MokaConstants.YES);

        // 검색어
        if (McpString.isNotEmpty(this.keyword)) {
            StringBuilder query = new StringBuilder();
            query.append(this.keyword);

            if (McpString.isNotEmpty(this.includeKeyword)) {
                query.append(" " + this.includeKeyword);
            }
            if (McpString.isNotEmpty(this.matchKeyword)) {
                query.append(" \"" + this.matchKeyword + "\"");
            }
            if (McpString.isNotEmpty(this.excluedeKeyword)) {
                query.append(" !" + this.excluedeKeyword);
            }

            parameter.put("query", query.toString());
        }

        // 검색 카테고리
        parameter.put("collection", this.searchCategoryType.getValue());

        // 기간
        if (this.periodType != PeriodType.ALL) {
            switch (this.periodType) {
                case ONE_DAY:
                    parameter.put("startDate", McpDate.dateStr(McpDate.now(), "yyyy.MM.dd"));
                    break;
                case ONE_WEEK:
                    parameter.put("startDate", McpDate.dateStr(McpDate.todayDatePlus(-7), "yyyy.MM.dd"));
                    break;
                case ONE_MONTH:
                    parameter.put("startDate", McpDate.dateStr(McpDate.todayMonthPlus(-1), "yyyy.MM.dd"));
                    break;
                case DIRECT_INPUT:
                    if (this.startSearchDate != null) {
                        parameter.put("startDate", McpDate.dateStr(this.startSearchDate, "yyyy.MM.dd"));
                    }
                    if (this.endSearchDate != null) {
                        parameter.put("endDate", McpDate.dateStr(this.endSearchDate, "yyyy.MM.dd"));
                    }
                    break;
            }
        }

        // 정렬
        parameter.put("sort", this.sortType.getValue());

        // 범위
        if (this.scopeType != ScopeType.ALL) {
            switch (this.searchCategoryType) {
                case UNIFIED_SEARCH: // 통합검색, 뉴스 검색, 중앙일보 검색, 전체뉴스 검색
                case NEWS:
                case JOONGANG_NEWS:
                case TOTAL_NEWS:
                case UNIFIED_SEARCH_MOBILE:
                    switch (this.scopeType) {
                        case TITLE_CONTENT:
                            parameter.put("sfield", "TITLE,CONTENTS");
                            break;
                        case TITLE:
                            parameter.put("sfield", "TITLE");
                            break;
                        case CONTENT:
                            parameter.put("sfield", "CONTENTS");
                            break;
                        case REPORTER:
                            parameter.put("sfield", "REPORTER");
                            break;
                    }
                    break;
                case ISSUE_NEWS:
                case ONLY_JOONGANG_NEWS:
                    switch (this.scopeType) {
                        case TITLE_CONTENT:
                            parameter.put("sfield", "ART_TITLE,ART_CONTENT");
                            break;
                        case TITLE:
                            parameter.put("sfield", "ART_TITLE");
                            break;
                        case CONTENT:
                            parameter.put("sfield", "ART_CONTENT");
                            break;
                        case REPORTER:
                            parameter.put("sfield", "ART_REPORTER");
                            break;
                        case KEYWORD:
                            parameter.put("sfield", "ART_KWD");
                            break;
                        case TITLE_KEYWORD_REPORTER:
                            parameter.put("sfield", "ART_TITLE,ART_KWD,ART_REPORTER");
                            break;
                    }
                    break;
                case JOONGANG_SUNDAY_NEWS: // 중앙선데이 검색
                    switch (this.scopeType) {
                        case TITLE_CONTENT:
                            parameter.put("sfield", "post_title,post_content");
                            break;
                        case TITLE:
                            parameter.put("sfield", "post_title");
                            break;
                        case CONTENT:
                            parameter.put("sfield", "post_content");
                            break;
                        case KEYWORD:
                            parameter.put("sfield", "tag");
                            break;
                        case REPORTER:
                            parameter.put("sfield", "");
                            break;
                    }
                    break;
                case IMAGE: // 이미지 검색
                    switch (this.scopeType) {
                        case TITLE_CONTENT:
                            parameter.put("sfield", "TITLE,CONTENTS");
                            break;
                        case TITLE:
                            parameter.put("sfield", "TITLE");
                            break;
                        case CONTENT:
                            parameter.put("sfield", "CONTENTS");
                            break;
                        case REPORTER:
                            parameter.put("sfield", "");
                            break;
                    }
                    break;
                case VIDEO: // 동영상 검색
                    switch (this.scopeType) {
                        case TITLE_CONTENT:
                            parameter.put("sfield", "ART_TITLE,ART_CONTENT");
                            break;
                        case TITLE:
                            parameter.put("sfield", "ART_TITLE");
                            break;
                        case CONTENT:
                            parameter.put("sfield", "ART_CONTENT");
                            break;
                        case REPORTER:
                            parameter.put("sfield", "");
                            break;
                        case KEYWORD:
                            parameter.put("sfield", "ART_KWD");
                            break;
                    }
                    break;
                case JOINS: // 조인스 검색
                    switch (this.scopeType) {
                        case TITLE_CONTENT:
                            parameter.put("sfield", "ART_TITLE,ART_CONTENT");
                            break;
                        case TITLE:
                            parameter.put("sfield", "ART_TITLE");
                            break;
                        case CONTENT:
                            parameter.put("sfield", "ART_CONTENT");
                            break;
                        case REPORTER:
                            parameter.put("sfield", "");
                            break;
                    }
                    break;
                case JPLUS: // J플러스 검색
                    switch (this.scopeType) {
                        case TITLE_CONTENT:
                            parameter.put("sfield", "ART_TITLE,ART_CONTENT");
                            break;
                        case TITLE:
                            parameter.put("sfield", "ART_TITLE");
                            break;
                        case CONTENT:
                            parameter.put("sfield", "ART_CONTENT");
                            break;
                        case REPORTER:
                            parameter.put("sfield", "ART_REPORTER");
                            break;
                    }
                    break;
                case BLOG: // 블로그 검색
                    switch (this.scopeType) {
                        case TITLE_CONTENT:
                            parameter.put("sfield", "TITLE,CONTENTS");
                            break;
                        case TITLE:
                            parameter.put("sfield", "TITLE");
                            break;
                        case CONTENT:
                            parameter.put("sfield", "CONTENTS");
                            break;
                        case REPORTER:
                            parameter.put("sfield", "");
                            break;
                    }
                    break;
                case REPORTER: //기자 검색
                    parameter.put("sfield", "REP_NAME");
                    break;
                case JOONGANG_NEWS_SUNDAY_NEWS: //모바일 기사 검색
                    switch (this.scopeType) {
                        case REPORTER:
                            parameter.put("sfield", "ART_REPORTER");
                            break;
                    }
                    break;
            }
        }

        // 매체 코드
        if (McpString.isNotEmpty(this.sourceCode)) {
            parameter.put("sourceCode", this.sourceCode);
        }

        // 매체 그룹 코드 (소스테스트필요)
        if (McpString.isNotEmpty(this.sourceGroupType)) {
            StringBuilder param = new StringBuilder();
            int i = 0;
            for (String item : this.sourceGroupType.split("\\|")) {
                if (SourceGroupType.containsValue(item)) {
                    param.append((i != 0 ? "," : "") + item);
                }
                //if (Enum.IsDefined(typeof(SourceGroupType), item)) {
                //    var sourceGroupType = (SourceGroupType) Enum.Parse(typeof(SourceGroupType), item);
                //    param.AppendFormat("{0}{1}", !i.Equals(0) ? "," : "", new SourceGroupTypeConverter().Convert(sourceGroupType));
                //}

                i++;
            }

            String srcGrpCodeString = param.toString();
            if (McpString.isNotEmpty(srcGrpCodeString)) {
                parameter.put("srcGrpCode", srcGrpCodeString);
            }
        }

        // 분야
        if (McpString.isNotEmpty(this.serviceCode)) {
            parameter.put("serviceCode", this.serviceCode);
        }

        // 분야
        if (McpString.isNotEmpty(this.masterCode)) {
            parameter.put("masterCode", this.masterCode);
        }

        // 기자명
        if (McpString.isNotEmpty(this.reporterCode)) {
            parameter.put("artReporterNo", this.reporterCode);
        }

        // 이미지형태
        if (this.imageType != ImageType.ALL) {
            parameter.put("imgCateCode", this.imageType.getValue());
        }

        // 블로그
        if (this.blogType != BlogType.ALL) {
            String sFieldValue = "";
            if (parameter.containsKey("sfield")) {
                sFieldValue = parameter
                        .get("sfield")
                        .toString();
            }
            if (McpString.isNotEmpty(sFieldValue)) {
                sFieldValue += ",";
            }

            switch (this.blogType) {
                case IMAGE:
                    parameter.put("isBlogImage", "Y");
                    break;
                case NICK_NAME:
                    sFieldValue += "USER_NAME,USER_NICKNAME";
                    break;
                case TAG:
                    sFieldValue += "TAG_LIST";
                    break;
            }

            if (this.blogType != BlogType.IMAGE) {
                if (parameter.containsKey("sfield")) {
                    parameter.put("sfield", sFieldValue);
                } else {
                    parameter.put("sfield", sFieldValue);
                }
            }
        }


        // J플러스
        if (this.jplusType != JplusType.ALL) {
            String sFieldValue = "";
            if (parameter.containsKey("sfield")) {
                sFieldValue = parameter
                        .get("sfield")
                        .toString();
            }
            if (McpString.isNotEmpty(sFieldValue)) {
                sFieldValue += ",";
            }

            switch (this.jplusType) {
                case WRITER_NAME:
                    sFieldValue += "ART_REPORTER";
                    break;
                case WRITER_JOB:
                    sFieldValue += "ART_REP_JOB";
                    break;
                case TAG:
                    sFieldValue += "ART_KWD";
                    break;
            }

            if (parameter.containsKey("sfield")) {
                parameter.put("sfield", sFieldValue);
            } else {
                parameter.put("sfield", sFieldValue);
            }
        }

        // 초성 검색
        if (this.chosung) {
            parameter.put("chosung", "y");
        }

        // 상세 검색 (소스테스트필요)
        if (McpString.isNotEmpty(this.detailSearch)) {
            StringBuilder detailSearchItem = new StringBuilder();
            for (String item : this.detailSearch.split(",")) {
                String detailSearchFieldType = item.split(":")[0];
                detailSearchItem.append(DetailSearchFieldType.getValue(Integer.parseInt(detailSearchFieldType)) + item.split(":")[1]);
                //String detailSearchFieldType = (DetailSearchFieldType) Enum.Parse(typeof(DetailSearchFieldType), item.Split(':')[0]);
                //detailSearchItem.AppendFormat("{0}:{1},", new DetailSearchFieldTypeConverter().Convert(detailSearchFieldType), item.Split(':')[1]);
            }

            parameter.put("detailSearch", detailSearchItem.toString());
        }

        // 중복문서 검출 여부
        if (!this.duplicate) {
            parameter.put("duplicate", "n");
        }

        // 검색 시작번호 (페이징 처리)
        if (this.start == 0 && this.page > 1) {
            parameter.put("startCount", Integer.toString((this.page - 1) * this.count));
        }

        if (this.start > 0) {
            parameter.put("startCount", Integer.toString(this.start));
        }

        // 페이지 사이즈
        if (this.count > 0) {
            parameter.put("listCount", Integer.toString(this.count));
        }


        return parameter;
    }
}
