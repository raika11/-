package jmnet.moka.web.bulk.task.bulkdump.vo.sub;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo.sub
 * ClassName : BulkDumpJobFile
 * Created : 2021-01-25 025 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-25 025 오전 9:32
 */
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class BulkDumpJobFileVo implements Serializable {
    private static final long serialVersionUID = 5802447282970501651L;

    @JsonProperty(value = "sourceFilePath")
    String sourceFilePath;

    @JsonProperty(value = "targetFileName")
    String targetFileName;
}
