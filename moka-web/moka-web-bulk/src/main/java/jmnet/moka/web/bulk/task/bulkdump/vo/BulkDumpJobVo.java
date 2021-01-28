package jmnet.moka.web.bulk.task.bulkdump.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvCP;
import jmnet.moka.web.bulk.task.bulkdump.vo.sub.BulkDumpJobFileVo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo
 * ClassName : BulkDumpJobVo
 * Created : 2021-01-25 025 sapark
 * </pre>
 *
 * @author sapark
 * @since 2021-01-25 025 오전 9:35
 */
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class BulkDumpJobVo implements Serializable {
    private static final long serialVersionUID = 5416277796034902855L;

    @JsonProperty(value = "totalId")
    private String totalId;

    @JsonProperty(value = "cpName")
    private String cpName;

    @JsonProperty(value = "dirWork")
    private String dirWork;

    @JsonProperty(value = "sourceJobFiles")
    private List<BulkDumpJobFileVo> sourceJobFiles;

    @JsonIgnore
    private String cpFormat;

    @JsonIgnore
    private String jobFileName;

    public static BulkDumpJobVo makeBulkDumpJob(BulkDumpEnvCP dumpEnvCP, BulkDumpJobTotalVo dumpJobTotal, String dirWork) {
        final BulkDumpJobVo newJob = BulkDumpJobVo
                .builder()
                .totalId(dumpJobTotal.getTotalId())
                .cpName(dumpEnvCP.getName())
                .dirWork(dirWork)
                .sourceJobFiles( new ArrayList<>())
                .build();
        dumpJobTotal.getBulkDumpJobs().add(newJob);
        return newJob;
    }
}
