import React from 'react';
import clsx from 'clsx';

/**
 * 메인 컴포넌트
 * @param {string} param0.className 오버라이드 스타일
 * @param {Element} param0.children children
 */
const Main = ({ className, children }) => <div className={clsx('main', 'custom-scroll', className)}>{children}</div>;

export default Main;
