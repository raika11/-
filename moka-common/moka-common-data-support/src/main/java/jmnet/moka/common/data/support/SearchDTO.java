package jmnet.moka.common.data.support;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.persistence.Column;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.exception.NoSortColumnException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.util.MultiValueMap;

/**
 * SearchDTO
 *
 * @author ince
 */
@AllArgsConstructor
@Setter
@Getter

public class SearchDTO implements Serializable {

    private static final long serialVersionUID = -2765846428393381760L;

    /**
     * 기본 페이지 수
     */
    final static int DEFAULT_PAGE = 0;

    /**
     * 기본 페이지당 조회 건수
     */
    final static int DEFAULT_SIZE = 30;

    /**
     * 페이지
     */
    private int page = DEFAULT_PAGE;

    /**
     * 페이지당 조회 건수
     */
    private int size = DEFAULT_SIZE;

    /**
     * 정렬 정보 key,order 형식
     */
    private List<String> sort;

    /**
     * 정렬 정보 key,order 형식
     */
    private MultiValueMap<String, String> extraParamMap;

    /**
     * 정렬필드조회용 VO클래스
     */
    protected Class<?> voClass;

    /**
     * 기본정렬정보
     */
    protected String defaultSort;

    /**
     * 검색타입
     */
    private String searchType;

    /**
     * 검색어
     */
    private String keyword;

    /**
     * 총갯수 사용여부
     */
    @Builder.Default
    private String useTotal = McpString.YES;

    /**
     * 총갯수
     */
    private Long total;

    /**
     * 검색결과 성공여부
     */
    private Integer returnValue;

    /**
     * @return the extraParamMap
     */
    public MultiValueMap<String, String> getExtraParamMap() {
        return extraParamMap;
    }

    /**
     * @param extraParamMap the extraParamMap to set
     */
    public void setExtraParamMap(MultiValueMap<String, String> extraParamMap) {
        this.extraParamMap = extraParamMap;
    }

    public String getFirst(String key) {
        return extraParamMap.getFirst(key);
    }

    public String getString(String key) {
        return McpString.defaultValue(extraParamMap.getFirst(key));
    }

    public String getString(String key, int idx) {
        return McpString.defaultValue(!extraParamMap.isEmpty() && extraParamMap.get(key) != null && extraParamMap
                .get(key)
                .size() > idx ? extraParamMap
                .get(key)
                .get(idx) : "");
    }

    public void add(String key, String value) {
        extraParamMap.add(key, value);
    }

    /**
     * Add all the values of the given list to the current list of values for the given key.
     *
     * @param key    they key
     * @param values the values to be added
     * @since 5.0
     */
    public void addAll(String key, List<String> values) {
        extraParamMap.addAll(key, values);
    }

    /**
     * Add all the values of the given {@code MultiValueMap} to the current values.
     *
     * @param values the values to be added
     * @since 5.0
     */
    public void addAll(MultiValueMap<String, String> values) {
        extraParamMap.addAll(values);
    }

    /**
     * Set the given single value under the given key.
     *
     * @param key   the key
     * @param value the value to set
     */
    public void set(String key, String value) {
        extraParamMap.set(key, value);
    }

    /**
     * Set the given values under.
     *
     * @param values the values.
     */
    public void setAll(Map<String, String> values) {
        extraParamMap.setAll(values);
    }



    /**
     * @return the page
     */
    public int getPage() {
        return page;
    }

    /**
     * @return the size
     */
    public int getSize() {
        return size;
    }

    /**
     * @return the sort
     */
    public List<String> getSort() {
        return sort;
    }

    /**
     * @param page the page to set
     */
    public void setPage(int page) {
        this.page = page;
    }

    /**
     * @param size the size to set
     */
    public void setSize(int size) {
        this.size = size;
    }

    /**
     * @param sort the sort to set
     */
    public void setSort(List<String> sort) {
        this.sort = sort;
    }

    /**
     * sort condition add, format:field,direction
     *
     * @param sort the sort to add
     */
    public void addSort(String sort) {
        if (this.sort != null) {
            this.sort.add(sort);
        }
    }

    /**
     * sort condition remove, format:field,direction
     *
     * @param sort the sort to remove
     */
    public void removeSort(String sort) {
        if (this.sort != null) {
            this.sort.remove(sort);
        }
    }

    /**
     * sort condition remove
     *
     * @param idx condition index
     */
    public void removeSort(int idx) {
        if (this.sort != null) {
            this.sort.remove(idx);
        }
    }

    /**
     * sort condition multiple remove
     *
     * @param list sort condition list
     */
    public void removeAllSort(Collection<String> list) {
        if (this.sort != null) {
            this.sort.removeAll(list);
        }
    }

    /**
     * sort condition clear
     */
    public void clearSort() {
        if (this.sort != null) {
            this.sort.clear();
        }
    }

    /**
     * Pageable 반환
     *
     * @return Pageable
     */
    public Pageable getPageable() {
        return PageRequest.of(page, size, Sort.by(getOrderList()));
    }

    /**
     * Pageable 반환
     *
     * @param sortList 정렬정보
     * @return Pageable
     */
    public Pageable getPageable(List<String> sortList) {
        return PageRequest.of(page, size, Sort.by(getOrderList(sortList)));
    }

    /**
     * 정렬 조건 목록 반환
     *
     * @return 정렬 조건 목록
     */
    public List<Order> getOrderList() {
        if (this.sort == null && McpString.isNotEmpty(defaultSort)) {
            List<String> sortList = new ArrayList<>(Collections.singletonList(this.defaultSort));
            this.setSort(sortList);
        }
        return getOrderList(this.sort);
    }

    /**
     * <pre>
     * 정렬 조건 목록 반환 파라미터로 받은 정렬정보와 서버에서 사용 할 정렬정보가
     * 서로 달라 매핑 처리해야 하는 경우 사용
     * 외부에서 정렬조건을 정제하여 사용
     * </pre>
     *
     * @param sortList 정렬정보
     * @return 정렬 조건 목록
     */
    public List<Order> getOrderList(List<String> sortList) {
        List<Order> orderList = new ArrayList<>();
        if (sortList != null) {
            sortList.forEach(item -> {
                if (item != null) {
                    if (item.split(",").length > 1) {
                        orderList.add(new Order(Direction.fromString(item.split(",")[1]), item.split(",")[0]));
                    } else {
                        orderList.add(Order.asc(item));
                    }
                }
            });
        }

        return orderList;
    }

    public SearchDTO() {
    }

    public SearchDTO(String defaultSort) {
        this.defaultSort = defaultSort;
    }

    public SearchDTO(Class<?> voClass, String defaultSort) {
        this.voClass = voClass;
        this.defaultSort = defaultSort;
    }

    public void setEntityClass(Class<?> voClass) {
        this.voClass = voClass;
    }

    public void setDefaultSort(String defaultSort) {
        this.defaultSort = defaultSort;
    }

    protected String getColumnNameFromAnnotation(String entityFieldName)
            throws NoSuchFieldException, SecurityException {
        Field field = voClass.getDeclaredField(entityFieldName);
        Column columnAnnotaion = field.getAnnotation(Column.class);
        return columnAnnotaion.name();
    }

    /**
     * <pre>
     * Vo기준 정렬필드조회
     * </pre>
     *
     * @return 정렬필드목록
     * @throws NoSortColumnException 정렬컬럼이 Vo에 없음 예외
     */
    protected List<String> getSortByColumn()
            throws NoSortColumnException {
        if (this.voClass == null) {
            throw new NoSortColumnException("Entity Class not set");
        }
        List<String> sortList = new ArrayList<>();
        if (this.sort == null && McpString.isNotEmpty(defaultSort)) {
            this.setSort(Collections.singletonList(this.defaultSort));
        } else {
            sortList.addAll(this.sort);
        }
        List<String> sortByColumnList = new ArrayList<>();
        for (String sort : sortList) {
            String[] splitted = sort.split(",");
            if (splitted.length == 2) {
                try {
                    sortByColumnList.add(getColumnNameFromAnnotation(splitted[0]) + " " + splitted[1]);
                } catch (NoSuchFieldException | SecurityException e) {
                    throw new NoSortColumnException(String.format("Sort Column not matched: %s %s", this.voClass.getName(), sort));
                }
            }
        }
        return sortByColumnList;
    }
}
