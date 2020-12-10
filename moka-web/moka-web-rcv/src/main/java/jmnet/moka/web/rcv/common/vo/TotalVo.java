package jmnet.moka.web.rcv.common.vo;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.util.RcvStringUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.common.vo
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

    public void logError( String errorMessage ) {
        log.error(errorMessage);
        this.errorMessageList.add(errorMessage);
    }

    public void logError(String s, Object...message) {
        logError(RcvStringUtil.format(s, message));
    }

    public void logInfo( String infoMessage ) {
        log.info(infoMessage);
        this.infoMessageList.add( infoMessage );
    }
    public void logInfo(String s, Object...message) {
        logInfo(RcvStringUtil.format(s, message));
    }
}
