package jmnet.moka.core.tps.mvc.achive.vo;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 공통 결과 메세지
 * 2017. 4. 21. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2017. 4. 21. 오후 2:59:15
 */
@SuppressWarnings("serial")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CmsResultListVO<T> implements Serializable {

    private Integer pageCount;
    private String errorMessage;
    private Integer count;
    private Integer start;
    private String errorCode;
    private Integer page;
    private Integer totalCount;
    private List<T> resultList;



}
