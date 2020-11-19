package jmnet.moka.web.rcv.common.object;

import java.io.File;
import java.lang.reflect.Type;
import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import jmnet.moka.web.rcv.common.vo.BasicVo;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.common.object
 * ClassName : JaxbObjectUnmarshaller
 * Created : 2020-11-17 017 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-17 017 오전 11:31
 */
public interface JaxbObjectUnmarshaller {
    BasicVo getBasicVoFromXml(File file)
            throws XMLStreamException, JAXBException;
     BasicVo getBasicVoFromString(String string)
             throws XMLStreamException, JAXBException;

    Type getObjectType();
}
