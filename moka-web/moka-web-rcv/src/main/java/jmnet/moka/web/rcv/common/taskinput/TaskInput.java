package jmnet.moka.web.rcv.common.taskinput;

import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.rcv.exception.RcvException;
import jmnet.moka.web.rcv.util.XMLUtil;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.input
 * ClassName : TaskInput
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:10
 */
public abstract class TaskInput {
    public abstract void load(Node node, XMLUtil xu)
            throws XPathExpressionException, RcvException;

    public abstract TaskInputData getTaskInputData();
}
