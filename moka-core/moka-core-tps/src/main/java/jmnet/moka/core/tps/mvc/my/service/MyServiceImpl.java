/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.my.service;

import jmnet.moka.core.tps.mvc.my.dto.MyEmailDTO;
import jmnet.moka.core.tps.mvc.my.mapper.MyMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-22
 */
@Service
@Slf4j
public class MyServiceImpl implements MyService {

    private final MyMapper myMapper;

    public MyServiceImpl(MyMapper myMapper) {
        this.myMapper = myMapper;
    }

    @Override
    public void updateEmail(MyEmailDTO myEmail) {
        myMapper.updateEmail(myEmail);
    }
}
