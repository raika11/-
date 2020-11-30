/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.dto;

/**
 * Description: 편집영역 트리용
 *
 * @author ssc
 * @since 2020-11-09
 */
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.area.vo.AreaVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 편집영역 트리를 만들기 위한 페이지 모델
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class AreaNode implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 영역일련번호
     */
    private Long areaSeq;

    /**
     * 영역명
     */
    private String areaNm;

    /**
     * 부모영역 SEQ
     */
    @Builder.Default
    private Long parentAreaSeq = (long) 0;

    /**
     * 부모페이지명
     */
    private String parentAreaNm;

    /**
     * 순서
     */
    private Integer ordNo = 1;

    /**
     * 영역구분(CP,CT)
     */
    private String areaDiv = MokaConstants.ITEM_COMPONENT;

    /**
     * 영역정렬:가로형H/세로형V
     */
    private String areaAlign = TpsConstants.AREA_ALIGN_V;

    /**
     * 자식노드
     */
    private List<AreaNode> nodes;

    /**
     * 노드생성
     *
     * @param area Area Entity
     */
    public AreaNode(AreaVO area) {
        this.areaSeq = area.getAreaSeq();
        this.areaNm = area.getAreaNm();
        this.parentAreaSeq = area.getParentAreaSeq();
        this.parentAreaNm = area.getParentAreaNm();
        this.ordNo = area.getOrdNo()
                         .intValue();
        this.areaDiv = area.getAreaDiv();
        this.areaAlign = area.getAreaAlign();
    }

    /**
     * 노드 찾기
     *
     * @param findAreaSeq 찾을 편집영역 아이디
     * @param rootNode    트리상의 찾기시작할 시작노드
     * @return
     */
    public AreaNode findNode(Long findAreaSeq, AreaNode rootNode) {
        if (findAreaSeq.equals(rootNode.getAreaSeq())) {
            return rootNode;
        } else {
            if (rootNode.hasChild()) {
                Iterator<AreaNode> iterator = rootNode.getNodes()
                                                      .iterator();
                while (iterator.hasNext()) {
                    AreaNode areaNode = iterator.next();
                    if (findAreaSeq.equals(areaNode.getAreaSeq())) {
                        return areaNode;
                    } else if (areaNode.hasChild()) {
                        AreaNode findNode = findNode(findAreaSeq, areaNode);
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
     * @param areaNode 추가할 노드
     */
    public void addNode(AreaNode areaNode) {
        if (this.nodes == null) {
            this.nodes = new ArrayList<>();
        }
        this.nodes.add(areaNode);
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

                        if (a.getOrdNo()
                             .equals(b.getOrdNo())) {
                            return (int) (long) (a.getAreaSeq() - b.getAreaSeq());
                        } else {
                            return a.getOrdNo() - b.getOrdNo();
                        }
                    });
            }
        }
    }
}
