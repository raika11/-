package jmnet.moka.core.tps.common.dto;

import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import com.google.common.collect.ForwardingList;

/**
 * 
 * <pre>
 * &#64;Valid on list of beans in REST service
 * 2020. 4. 23. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 23. 오후 5:11:55
 * @author jeon
 * @param <T>
 */
public class ValidList<T> extends ForwardingList<T> {

    private List<@Valid T> list;

    public ValidList() {
        this(new ArrayList<>());
    }

    public ValidList(List<@Valid T> list) {
        this.list = list;
    }

    @Override
    protected List<T> delegate() {
        return list;
    }

    /** Exposed for the {@link javax.validation.Validator} to access the list path */
    public List<T> getList() {
        return list;
    }
}
