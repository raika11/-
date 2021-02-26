package jmnet.moka.web.bulk.task.bulkdump.process.basic;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo
 * ClassName : BulkDumpEnvCopyright
 * Created : 2021-02-09 009 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-02-09 009 오전 11:25
 */
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class BulkDumpEnvCopyright implements Serializable {
    private static final long serialVersionUID = -1185855937066042299L;

    @JsonProperty(value = "CR_HTML_NAVER")
    private String crHtmlNaver;

    @JsonProperty(value = "JHOT_CLICK")
    private String jhotClick;

    @JsonProperty(value = "CR_HTML")
    private String crHtml;

    @JsonProperty(value = "CR_TXT")
    private String crTxt;
}
