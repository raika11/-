package jmnet.moka.web.rcv.common.object;

import java.io.File;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javax.xml.transform.stream.StreamSource;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.task.input.base
 * ClassName : JaxbObjectUnmarshaller
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오후 2:10
 */
@Getter
@Slf4j
public class JaxbObjectUnmarshaller<T> {
    private final JAXBContext jaxbContext;
    private final Class<T> objectType;

    public JaxbObjectUnmarshaller(Class<T> objectType)
            throws JAXBException {
        this.objectType = objectType;
        jaxbContext = JAXBContext.newInstance(objectType);
    }

    public T getBasicVoFromXml(File file)
            throws XMLStreamException, JAXBException {
        XMLInputFactory xif = XMLInputFactory.newFactory();
        XMLStreamReader xsr = xif.createXMLStreamReader(new StreamSource(file));
        Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
        JAXBElement<T> jb = unmarshaller.unmarshal(xsr, this.objectType);
        T vo = jb.getValue();
        xsr.close();
        return vo;
    }
}
