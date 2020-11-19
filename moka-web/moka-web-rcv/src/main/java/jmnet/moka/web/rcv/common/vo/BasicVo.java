package jmnet.moka.web.rcv.common.vo;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo.basic
 * ClassName : BasicVo
 * Created : 2020-10-29 029 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-29 029 오후 2:33
 */
@Getter
@Setter
@XmlRootElement(name="basic")
@XmlAccessorType(XmlAccessType.FIELD)
public class BasicVo implements Serializable {
    private static final long serialVersionUID = -7722412583792806630L;

    private int returnValue;
}
