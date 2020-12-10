package jmnet.moka.web.rcv.task.jamxml.vo.sub;

import java.io.Serializable;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.vo.jamarticle
 * ClassName : ContentsVo
 * Created : 2020-10-28 028 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-28 028 오후 1:15
 */

@SuppressWarnings("unused")
@Getter
@Setter
@XmlRootElement(name = "id")
@XmlAccessorType(XmlAccessType.FIELD)
public class ContentsVo implements Serializable {
    private static final long serialVersionUID = -7644425404389956772L;

    @XmlElement(name = "body")
    private String body;

    @XmlElementWrapper(name = "multi_items")
    @XmlElement(name = "item")
    private List<ItemVo> items;

    public ItemVo getItemsByType( String type ) {
        for( ItemVo item : items ){
            if( item.getType().equals(type) )
                return item;
        }
        return null;
    }
}
