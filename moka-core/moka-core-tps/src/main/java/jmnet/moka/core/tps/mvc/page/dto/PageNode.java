package jmnet.moka.core.tps.mvc.page.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 페이지 트리를 만들기 위한 페이지 모델
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class PageNode implements Serializable {

    private static final long serialVersionUID = 6439704006098130993L;

    /**
     * 페이지SEQ
     */
    private Long pageSeq;

    /**
     * 페이지명
     */
    private String pageName;

    /**
     * 페이지URL
     */
    private String pageUrl;

    /**
     * 부모페이지 SEQ
     */
    @Builder.Default
    private Long parentPageSeq = (long) 0;

    /**
     * 부모페이지명
     */
    private String parentPageName;

    /**
     * 부모페이지URL
     */
    private String parentPageUrl;

    /**
     * 페이지순서
     */
    @Builder.Default
    private Integer pageOrd = 1;

    /**
     * 버튼아이콘 표시여부
     */
    @Builder.Default
    private boolean btnShow = false;

    /**
     * 검색 일치 여부
     */
    @Builder.Default
    private boolean match = false;

    /**
     * 사용여부
     */
    @Builder.Default
    private String useYn = MokaConstants.YES;

    /**
     * 자식노드
     */
    private List<PageNode> nodes;

    /**
     * 노드생성
     *
     * @param page Page Entity
     */
    public PageNode(Page page) {
        this.pageSeq = page.getPageSeq();
        this.pageName = page.getPageName();
        this.pageUrl = page.getPageUrl();
        this.parentPageSeq = page.getParent() == null
                ? 0
                : page.getParent()
                      .getPageSeq();
        this.parentPageName = page.getParent() == null
                ? null
                : page.getParent()
                      .getPageName();
        this.parentPageUrl = page.getParent() == null
                ? null
                : page.getParent()
                      .getPageUrl();
        this.pageOrd = page.getPageOrd()
                           .intValue();
        this.btnShow = false;
        this.useYn = page.getUseYn()
                         .equals("Y") ? "Y" : "N";
    }

    /**
     * 노드 찾기
     *
     * @param findPageId 찾을 페이지 아이디
     * @param rootNode   트리상의 찾기시작할 시작노드
     * @return
     */
    public PageNode findNode(Long findPageSeq, PageNode rootNode) {
        if (findPageSeq.equals(rootNode.getPageSeq())) {
            return rootNode;
        } else {
            if (rootNode.hasChild()) {
                Iterator<PageNode> iterator = rootNode.getNodes()
                                                      .iterator();
                while (iterator.hasNext()) {
                    PageNode pageNode = iterator.next();
                    if (findPageSeq.equals(pageNode.getPageSeq())) {
                        return pageNode;
                    } else if (pageNode.hasChild()) {
                        PageNode findNode = findNode(findPageSeq, pageNode);
                        if (findNode != null) {
                            return findNode;
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * 자식존재여부 조사
     *
     * @return 존재여부
     */
    public boolean hasChild() {
        return this.getNodes() != null && this.getNodes()
                                              .size() > 0 ? true : false;
    }

    /**
     * 자식노드 추가
     *
     * @param pageNode
     */
    public void addNode(PageNode pageNode) {
        if (this.nodes == null) {
            this.nodes = new ArrayList<>();
        }
        this.nodes.add(pageNode);
    }

    /**
     * 정렬
     */
    public void sort() {
        if (this.getNodes() != null) {
            // 자식노드가 하나만 있을경우는, 자식의 자식노드를 정렬하도록 한다.
            if (this.getNodes()
                    .size() == 1) {
                this.getNodes()
                    .get(0)
                    .sort();
            } else {
                this.getNodes()
                    .sort((a, b) -> {

                        if (a.getNodes() != null && a.getNodes()
                                                     .size() > 0) {
                            a.sort();
                        }
                        if (b.getNodes() != null && b.getNodes()
                                                     .size() > 0) {
                            b.sort();
                        }

                        return a.getPageOrd() - b.getPageOrd();
                    });
            }
        }
    }
}
