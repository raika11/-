package jmnet.moka.web.rcv.common.object;

import java.io.File;
import java.lang.reflect.Type;
import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamException;
import jmnet.moka.web.rcv.common.vo.BasicVo;
import jmnet.moka.web.rcv.task.jamxml.vo.JamArticleVo;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.input.object
 * ClassName : JaxbObjectManager
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오후 2:26
 */
@Slf4j
public class JaxbObjectManager {
    private static JaxbObjectUnmarshaller<JamArticleVo> jamArticleVoUnmarshaller;

    static {
        try {
            jamArticleVoUnmarshaller = new JaxbObjectUnmarshaller<>(JamArticleVo.class);
        } catch (JAXBException e) {
            log.error("jaxbContext create error", e);
        }
    }

    public static BasicVo getBasicVoFromXml(File file, Type objectType)
            throws XMLStreamException, JAXBException {
        if (jamArticleVoUnmarshaller.getObjectType() == objectType) {
            return jamArticleVoUnmarshaller.getBasicVoFromXml(file);
        }
        return null;
    }
}
