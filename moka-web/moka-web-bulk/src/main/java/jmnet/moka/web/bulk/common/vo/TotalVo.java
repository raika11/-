package jmnet.moka.web.bulk.common.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.bulk.util.BulkStringUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.common.vo
 * ClassName : TotalVo
 * Created : 2020-11-05 005 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-05 005 오후 4:21
 */

@Slf4j
@Getter
@Setter
@XmlRootElement(name = "article")
@XmlAccessorType(XmlAccessType.FIELD)
public class TotalVo <T> extends BasicVo {
    private static final long serialVersionUID = -496382951869605085L;
    protected final T mainData;
    protected List<String> errorMessageList = new ArrayList<>();
    protected List<String> infoMessageList = new ArrayList<>();
    private String msg;

    public TotalVo(T mainData) {
        this.mainData = mainData;
    }

    @SuppressWarnings("unused")
    public String getErrorMessageList(){
        String ret = "";
        for( String s : this.errorMessageList) {
            if( !McpString.isNullOrEmpty( ret ) )
                ret = ret.concat("\n");
            ret = ret.concat(s);
        }
        return ret;
    }

    public void setInfoMessageFlush(){
        this.infoMessageList.clear();
    }

    public String getInfoMessageList(){
        String ret = "";
        for( String s : this.infoMessageList) {
            ret = ret.concat(s).concat("\n");
        }
        return ret;
    }

    public String logError( String errorMessage ) {
        log.error(errorMessage);
        this.infoMessageList.add(McpDate.dateStr(new Date(), McpDate.DATETIME_FORMAT + " ") + errorMessage);
        this.errorMessageList.add(McpDate.dateStr(new Date(), McpDate.DATETIME_FORMAT + " ") + errorMessage);
        return errorMessage;
    }

    public String logError(String s, Object...message) {
        return logError(BulkStringUtil.format(s, message));
    }

    public String logInfo( String infoMessage ) {
        log.info(infoMessage);
        this.infoMessageList.add(McpDate.dateStr(new Date(), McpDate.DATETIME_FORMAT + " ") + infoMessage );

        return infoMessage;
    }
    public String logInfo(String s, Object...message) {
        return logInfo(BulkStringUtil.format(s, message));
    }
}
