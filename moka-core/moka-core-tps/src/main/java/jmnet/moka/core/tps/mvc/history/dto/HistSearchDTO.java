/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.text.ParseException;
import java.util.Date;
import java.util.regex.Matcher;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 * 히스토리 검색조건
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 21. 오전 11:17:39
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class HistSearchDTO extends SearchDTO {

    private static final long serialVersionUID = -6207554369251550982L;
    public static final String DATE_REGX = "(19|20)\\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])";

    /**
     * SEQ
     */
    @Min(value = 1, message = "{tps.history.error.min.seq}")
    private Long seq;

    /**
     * SEQ의 유형 (PG:페이지, CS: 기사타입, TP:템플릿, CT:컨테이너)
     */
    @Pattern(regexp = "^(PG)|(CS)|(CT)|(TP)|()$", message = "{tps.history.error.pattern.seqType}")
    private String seqType;

    // 정렬 기본값을 설정
    public HistSearchDTO() {
        super("regDt,desc");
        super.setUseTotal(MokaConstants.YES);
        super.setSearchType(TpsConstants.SEARCH_TYPE_ALL);
        super.setReturnValue(TpsConstants.PROCEDURE_SUCCESS);
    }

    public String getStartRegDt() {
        if(this.getSearchType().equals("regDt")) {
            String keyword = this.getKeyword(); // 날짜검색은 YYYY-MM-DD만 가능.
            java.util.regex.Pattern pattern = java.util.regex.Pattern
                .compile(DATE_REGX, java.util.regex.Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(keyword);
            if(matcher.find()) {
                return keyword;
            } else {
                return null;
            }
        }
        return null;
    }

    public String getEndRegDt() throws ParseException {
        if(this.getSearchType().equals("regDt")) {
            String keyword = this.getKeyword(); // 날짜검색은 YYYY-MM-DD만 가능.
            java.util.regex.Pattern pattern = java.util.regex.Pattern
                .compile(DATE_REGX, java.util.regex.Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(keyword);
            if(matcher.find()) {
                Date startDate = McpDate.date(keyword);
                Date endDate = McpDate.datePlus(startDate, 1);  // 마지막날은 +1
                String endDateStr = McpDate.dateStr(endDate, TpsConstants.HISTORY_DATE_FORMAT);
                return endDateStr;
            } else {
                return null;
            }
        }
        return null;
    }
}
