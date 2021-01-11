package jmnet.moka.web.bulk.task.bulkdump.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.Date;
import jmnet.moka.web.bulk.common.taskinput.TaskInputData;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.bulkdump.vo
 * ClassName : BulkDumpVo
 * Created : 2020-12-21 021 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-21 021 오전 11:10
 */
@Getter
@Setter
public class BulkDumpTotalVo implements Serializable {
    private static final long serialVersionUID = -1262311176929063347L;

    @JsonProperty(value = "SEQ_NO")
    private Integer seqNo;

    @JsonProperty(value = "INS_DT")
    private Date insDt;

    @JsonProperty(value = "SOURCE_CODE")
    private String sourceCode;

    @JsonProperty(value = "TARGET_CODE")
    private String targetCode;

    @JsonProperty(value = "IUD")
    private String iud;

    @JsonProperty(value = "TOTAL_ID")
    private Integer totalId;

    private TaskInputData taskInputData;

    public boolean isDdrefValid() {
        //noinspection ConstantConditions,LoopStatementThatDoesntLoop
        do {
            if( this.seqNo == null )
                break;
            if( this.insDt == null )
                break;
            if( this.sourceCode == null )
                break;
            if( this.targetCode == null )
                break;
            if( this.iud == null )
                break;
            if( this.totalId == null )
                break;
            return true;
        }while (false);

        return false;
    }
}
