package jmnet.moka.web.bulk.task.bulkdump.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.task.bulkdump.env.sub.BulkDumpEnvCP;
import jmnet.moka.web.bulk.task.bulkdump.process.basic.BulkDumpResult;
import jmnet.moka.web.bulk.task.bulkdump.vo.sub.BulkDumpJobFileVo;
import jmnet.moka.web.bulk.util.BulkFileUtil;
import jmnet.moka.web.bulk.util.BulkUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/**
 * <pre>
 *
 * Project : moka-web-bulk
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo
 * ClassName : BulkDumJobTotalVo
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
public class BulkDumpJobTotalVo implements Serializable {
    private static final long serialVersionUID = -48467953012635070L;

    @JsonProperty(value = "seqNo")
    private int seqNo;

    @JsonProperty(value = "totalId")
    private String totalId;

    @JsonProperty(value = "sourceDir")
    private String sourceDir;

    @JsonProperty(value = "sourceFileNames")
    private List<String> sourceFileNames;

    @JsonProperty(value = "jobFileNames")
    private List<String> jobFileNames;

    @JsonIgnore
    private List<BulkDumpJobVo> bulkDumpJobs;

    @JsonIgnore
    private AtomicInteger serialNumber;

    private boolean isNotFinalDump;

    public static BulkDumpJobTotalVo makeBulkDumpJobTotal(int dumpSeqNo, String totalId, String dirDump) {
        final String sourceDir = Paths.get( dirDump, String.format( "%010d", dumpSeqNo )).toString();
        BulkFileUtil.createDirectories(sourceDir);
        return BulkDumpJobTotalVo
                .builder()
                .seqNo(dumpSeqNo)
                .totalId(totalId)
                .sourceDir( sourceDir )
                .sourceFileNames(new ArrayList<>())
                .jobFileNames(new ArrayList<>())
                .bulkDumpJobs( new ArrayList<>())
                .serialNumber( new AtomicInteger(0))
                .build();
    }

    public String getBulkJobFileName(String fileExt) {
        return String.format( "%s_%s_%03d.%s", this.totalId, McpDate.dateStr(new Date(),"yyyyMMddHHmmss"), getSerialNumber() % 1000, fileExt );
    }

    public boolean downloadData(BulkDumpJobVo dumpJob, BulkDumpNewsMMDataVo newsMMData, String dataUrl, String fileExtension, String filename) {
        String downloadFileName = newsMMData.getDownloadFileName();
        if(McpString.isNullOrEmpty( downloadFileName) ) {
            downloadFileName = Paths.get(this.sourceDir, getBulkJobFileName(fileExtension)).toString();
            int retry = 3;
            boolean success;
            do {
                success = BulkUtil.downloadData(dataUrl, downloadFileName);
                if( success )
                    break;
            }while( retry-- > 0);
            if( !success )
                return false;

            newsMMData.setDownloadFileName( downloadFileName );
            this.sourceFileNames.add( downloadFileName );
        }
        dumpJob.getSourceJobFiles().add( new BulkDumpJobFileVo( downloadFileName, filename));
        return true;
    }

    public int getSerialNumber() {
        return serialNumber.incrementAndGet();
    }

    public boolean exportDumpJob(BulkDumpEnvCP dumpEnvCP, BulkDumpJobVo dumpJob, ObjectMapper mapper) {
        final String jobFile = Paths.get(dumpEnvCP.getDir(), getBulkJobFileName("json")).toString();
        if( jobFile == null )
            return false;
        try {
            mapper.writeValue( new File(jobFile), dumpJob );
            dumpJob.setJobFileName(jobFile);
            jobFileNames.add( jobFile );
        } catch (IOException ignore) {
            return false;
        }
        return true;
    }

    public BulkDumpResult exportDumpJobTotal(String dumpEnvCP, ObjectMapper mapper) {
        final String jobFile = Paths.get(dumpEnvCP, getBulkJobFileName("json")).toString();
        if( jobFile == null )
            return BulkDumpResult.FAIL_DUMP_CP_TOTAL;
        try {
            mapper.writeValue( new File(jobFile), this );
        } catch (IOException ignore) {
            return BulkDumpResult.FAIL_DUMP_CP_TOTAL;
        }
        return BulkDumpResult.SUCCESS;
    }
}
