package jmnet.moka.web.rcv.task.cpxml.vo.sub;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : CategoryVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 2:43
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "category")
@XmlAccessorType(XmlAccessType.FIELD)
public class CpCategoryVo implements Serializable {
    private static final long serialVersionUID = 3590126080831095487L;

    @XmlElement(name = "type")
    private String type;

    @XmlElement(name = "code")
    private String code;

    @XmlElement(name = "name")
    private String name;
}
