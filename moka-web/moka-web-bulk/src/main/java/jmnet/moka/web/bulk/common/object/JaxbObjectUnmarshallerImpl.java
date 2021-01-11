package jmnet.moka.web.bulk.common.object;

import java.io.File;
import java.io.StringReader;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javax.xml.transform.stream.StreamSource;
import jmnet.moka.web.bulk.common.vo.BasicVo;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.task.input.base
 * ClassName : JaxbObjectUnmarshaller
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오후 2:10
 */
@Getter
@Slf4j
public class JaxbObjectUnmarshallerImpl<T> implements JaxbObjectUnmarshaller {
    private final JAXBContext jaxbContext;
    private final Class<T> objectType;

    public JaxbObjectUnmarshallerImpl(Class<T> objectType)
            throws JAXBException {
        this.objectType = objectType;
        jaxbContext = JAXBContext.newInstance(objectType);
    }

    public BasicVo getBasicVoFromXml(File file)
            throws XMLStreamException, JAXBException {
        XMLInputFactory xif = XMLInputFactory.newFactory();
        XMLStreamReader xsr = xif.createXMLStreamReader(new StreamSource(file));
        Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
        JAXBElement<T> jb = unmarshaller.unmarshal(xsr, this.objectType);
        BasicVo vo = (BasicVo) jb.getValue();
        xsr.close();
        return vo;
    }

    public BasicVo getBasicVoFromString(String string)
            throws XMLStreamException, JAXBException {
        XMLInputFactory xif = XMLInputFactory.newFactory();
        XMLStreamReader xsr = xif.createXMLStreamReader(new StringReader(string));
        Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
        JAXBElement<T> jb = unmarshaller.unmarshal(xsr, this.objectType);
        BasicVo vo = (BasicVo) jb.getValue();
        xsr.close();
        return vo;
    }
}
