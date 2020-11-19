package jmnet.moka.web.rcv.common.taskinput.inputfilter;

import java.io.File;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.util.XMLUtil;
import lombok.Getter;
import lombok.Setter;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.common.taskinput.inputfilter
 * ClassName : InputFilter
 * Created : 2020-11-18 018 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-18 018 오후 1:48
 */
@Getter
@Setter
public abstract class InputFilter {
    public InputFilter(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
        load(node, xu);
    }

    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
    }

    public abstract boolean doProcess(File file);
}
