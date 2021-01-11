package jmnet.moka.web.rcv.taskinput;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.rcv.common.taskinput.TaskInput;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.util.XMLUtil;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.taskinput
 * ClassName : DBTaskInput
 * Created : 2020-12-01 001 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-12-01 001 오후 4:41
 */
public abstract class  DBTaskInput extends TaskInput {
    @SuppressWarnings("RedundantThrows")
    @Override
    public void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException {
    }
}
