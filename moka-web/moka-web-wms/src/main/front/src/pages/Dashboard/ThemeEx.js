import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const ThemeEx = () => {
    return (
        <React.Fragment>
            <Form.Row className="mb-1">
                <Form.Label className="h4">1) Action Button</Form.Label>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="positive" size="lg" className="w-100">
                        positive
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="positive"</p>
                        <p className="mb-0">확인,등록,저장에 사용한다</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="negative" size="lg" className="w-100">
                        negative
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="negative"</p>
                        <p className="mb-0">삭제,취소,리셋에 사용한다</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="outline-neutral" size="lg" className="w-100">
                        outline-neutral
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="outline-neutral"</p>
                        <p className="mb-0">상단영역의 부가 버튼에 사용한다</p>
                    </div>
                </Col>
            </Form.Row>

            <hr className="divider" />

            <Form.Row className="mb-1">
                <Form.Label className="h4">2) Table Button</Form.Label>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="outline-table-btn" size="lg" className="w-100">
                        outline-table-btn
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="outline-table-btn"</p>
                        <p className="mb-0">테이블 안에서 사용하는 기본 버튼</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="outline-table-btn2" size="lg" className="w-100">
                        outline-table-btn2
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="outline-table-btn2"</p>
                        <p className="mb-0">테이블 안에서 사용하며 테이블 기본 버튼보다 진함</p>
                    </div>
                </Col>
            </Form.Row>

            <hr className="divider" />

            <Form.Row className="mb-1">
                <Form.Label className="h4">3) gray-* Button</Form.Label>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="gray-150" size="lg" className="w-100">
                        gray-150
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="gray-150"</p>
                        <p className="mb-0">템플릿 리스트타입 선택 버튼에만 쓰임</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="gray-700" size="lg" className="w-100">
                        gray-700
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="gray-700"</p>
                        <p className="mb-0">이미지 신규등록 버튼</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="outline-gray-700" size="lg" className="w-100">
                        outline-gray-700
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="outline-gray-700"</p>
                        <p className="mb-0">이미지 편집 버튼</p>
                    </div>
                </Col>
            </Form.Row>

            <hr className="divider" />

            <Form.Row className="mb-1">
                <Form.Label className="h4">4) 그 외 Button</Form.Label>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="primary" size="lg" className="w-100">
                        primary
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="primary"</p>
                        <p className="mb-0">positive와 동일한 색상</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="secondary" size="lg" className="w-100">
                        secondary
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="secondary"</p>
                        <p className="mb-0">outline-neutral과 동일한 색상</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="success" size="lg" className="w-100">
                        success
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="success"</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="info" size="lg" className="w-100">
                        info
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="info"</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="searching" size="lg" className="w-100">
                        searching
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="searching"</p>
                        <p className="mb-0">검색버튼에 사용한다</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="danger" size="lg" className="w-100">
                        danger
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="danger"</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="warning" size="lg" className="w-100">
                        warning
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="warning"</p>
                    </div>
                </Col>
            </Form.Row>

            <hr className="divider" />

            <Form.Row className="mb-1">
                <Form.Label className="h4">5) 소셜 Button</Form.Label>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="outline-fb" size="lg" className="w-100">
                        Facebook
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="outline-fb"</p>
                        <p className="mb-0">페이스북 버튼</p>
                    </div>
                </Col>
            </Form.Row>

            <Form.Row className="mb-3 align-items-center">
                <Col className="p-0 pr-3" xs={4}>
                    <Button variant="outline-tw" size="lg" className="w-100">
                        Twitter
                    </Button>
                </Col>
                <Col className="p-0" xs={8}>
                    <div className="d-flex flex-column">
                        <p className="mb-0 mr-2 h5">variant="outline-tw"</p>
                        <p className="mb-0">트위터 버튼</p>
                    </div>
                </Col>
            </Form.Row>

            <hr className="divider" />

            <Form.Row className="mb-1">
                <Form.Label className="h4">5) 폰트 색상</Form.Label>
            </Form.Row>

            {['primary', 'secondary', 'success', 'info', 'searching', 'danger', 'warning'].map((color) => (
                <Form.Row key={color} className="mb-3 align-items-center">
                    <p className={`mb-0 mr-2 h5`}>.color-{color}</p>
                    <p className={`mb-0 color-${color}`}>텍스트에 테마 컬러 적용</p>
                </Form.Row>
            ))}

            <hr className="divider" />

            {['gray-100', 'gray-200', 'gray-300', 'gray-400', 'gray-500', 'gray-600', 'gray-700', 'gray-800', 'gray-900'].map((color) => (
                <Form.Row key={color} className="mb-3 align-items-center">
                    <p className={`mb-0 mr-2 h5`}>.color-{color}</p>
                    <p className={`mb-0 color-${color}`}>body 텍스트 컬러</p>
                </Form.Row>
            ))}
        </React.Fragment>
    );
};

export default ThemeEx;
