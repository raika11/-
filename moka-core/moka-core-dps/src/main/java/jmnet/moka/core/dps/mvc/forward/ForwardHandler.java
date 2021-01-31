package jmnet.moka.core.dps.mvc.forward;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.util.ResourceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;


public class ForwardHandler {

    public static final Logger logger = LoggerFactory.getLogger(ForwardHandler.class);
    @Autowired
    private GenericApplicationContext appContext;

    private List<Forward> forwardList;

    private ForwardParser forwardParser;

    public ForwardHandler(String configForwardPath)
            throws IOException, ParserConfigurationException, XPathExpressionException {
        if (McpString.isEmpty(configForwardPath)) { // forward list가 없을 경우
            this.forwardList = new ArrayList<>(0);
            return;
        }
        ResourcePatternResolver patternResolver = ResourceMapper.getResouerceResolver();
        Resource resource = patternResolver.getResource(configForwardPath);
        this.forwardParser = new ForwardParser(resource);
        this.forwardList = forwardParser.getForwardList();
    }

    /**
     * forward 시킬 경로가 있는지 판단한다.
     * @param request http 요청
     * @return forward 여부
     */
    public boolean forwardable(HttpServletRequest request) {
        for ( Forward forward : this.forwardList) {
            if ( forward.matches(request)) return true;
        }
        return false;
    }

    /**
     * forward 정보를 반환한다.
     * @param request http요청
     * @return forward 정보
     */
    public Forward getForward(HttpServletRequest request) {
        for ( Forward forward : this.forwardList) {
            if ( forward.matches(request)) return forward;
        }
        return null;
    }
}
