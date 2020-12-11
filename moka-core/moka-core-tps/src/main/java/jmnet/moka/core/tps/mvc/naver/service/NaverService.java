/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-10
 */
public interface NaverService {

    /**
     * newsStand전송
     *
     * @param source
     * @param areaSeq
     */
    void publishNewsStand(String source, Long areaSeq);
}
