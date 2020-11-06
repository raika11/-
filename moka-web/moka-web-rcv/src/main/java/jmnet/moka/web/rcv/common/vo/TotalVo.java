package jmnet.moka.web.rcv.common.vo;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import jmnet.moka.web.rcv.util.RcvStringUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.codehaus.commons.compiler.util.StringUtil;

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
    protected List<String> errorMessage = new ArrayList<>();

    public TotalVo(T mainData) {
        this.mainData = mainData;
    }

    public void logError( String errorMessage ) {
        log.error(errorMessage);
        this.errorMessage.add(errorMessage);
    }

    public String getErrorMessage(){
        String ret = "";
        for( String s : this.errorMessage ) {
            if( !McpString.isNullOrEmpty( ret ) )
                ret = ret.concat("\n");
            ret = ret.concat(s);
        }
        return ret;
    }

    public void logError(String s, Object...message) {
        logError(RcvStringUtil.format(s, message));
    }
}
