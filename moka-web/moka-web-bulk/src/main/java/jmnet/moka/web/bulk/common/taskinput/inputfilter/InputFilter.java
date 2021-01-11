package jmnet.moka.web.bulk.common.taskinput.inputfilter;

import java.io.File;
import javax.xml.xpath.XPathExpressionException;
import jmnet.moka.web.bulk.exception.BulkException;
import jmnet.moka.web.bulk.util.XMLUtil;
import lombok.Getter;
import lombok.Setter;
import org.w3c.dom.Node;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.common.taskinput.inputfilter
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
            throws XPathExpressionException, BulkException {
        load(node, xu);
    }

    protected void load(Node node, XMLUtil xu)
            throws XPathExpressionException, BulkException {
    }

    public abstract boolean doProcess(File file);
}
