import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { MokaIcon, MokaInput } from '@components';

// export const propTypes = {
//     /**
//      * 드롭다운 className
//      */
//     className: PropTypes.string,
//     /**
//      * width
//      */
//     width: PropTypes.number,
//     /**
//      * toggleId
//      */
//     toggleId: PropTypes.string,
//     /**
//      * 드롭다운 메뉴
//      */
//     menus: PropTypes.arrayOf(
//         PropTypes.shape({
//             cd: PropTypes.string,
//             name: PropTypes.string,
//             label: PropTypes.string,
//         }),
//     ),
// };
// const defaultProps = {
//     width: 120,
//     menus: [],
// };

const EditThumbSelectDropdown = (props) => {
    const { className, width, toggleId, menus } = props;

    // state
    const [count, setCount] = useState(0);
    // const [value, setValue] = useState([]);
    const [value, setValue] = useState('');

    /**
     * 커스텀 토글
     */
    const CustomToggle = forwardRef(({ children, onClick }, ref) => {
        return (
            <div
                ref={ref}
                className="d-flex flex-fill justify-content-between align-items-center"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
            >
                {children}
                <MokaIcon iconName="fal-sort" />
            </div>
        );
    });

    /**
     * 커스텀 메뉴
     */
    // const CustomMenu = forwardRef(({ inputStyle, inputClassName, children }, ref) => {
    //     return (
    //         <div ref={ref} style={inputStyle} className={inputClassName}>
    //             {/* {menus &&
    //                 menus.map((menu) => ( */}
    //             {/* <MokaInput
    //                 as="checkbox"
    //                 // id={`type-check-${menu.name}`}
    //                 id={`type-check-id`}
    //                 // key={menu.cd}
    //                 className="mx-3 my-2 w-auto"
    //                 // value={menu.name}
    //                 // onChange={(e) => {
    //                 //     if (e.target.checked) {
    //                 //         setValue([...value, e.target.value]);
    //                 //         setCount(count + 1);
    //                 //     } else {
    //                 //         setCount(count - 1);
    //                 //     }
    //                 // }}
    //                 inputProps={{ label: '테스트', custom: true }}
    //             /> */}
    //             <ul className="list-unstyled">
    //                 {children}
    //             </ul>
    //             {/* ))} */}
    //         </div>
    //     );
    // });

    return (
        <Dropdown className={clsx('flex-fill', className)}>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                커스텀 메뉴 {count}개
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item
                    eventKey="1"
                    as="div"
                    onSelect={(e) => {
                        setCount(count + 1);
                    }}
                >
                    <Form.Check
                        type="checkbox"
                        // id={`type-check-${menu.name}`}
                        // id="type-check-id"
                        className="w-100"
                        custom
                        // key={menu.cd}
                        // value={menu.name}
                        // onChange={(e) => {
                        //     if (e.target.checked) {
                        //         setValue([...value, e.target.value]);
                        //         setCount(count + 1);
                        //     } else {
                        //         setCount(count - 1);
                        //     }
                        // }}
                        // inputProps={{ label: '테스트', custom: true }}
                        label="테스트"
                    />
                </Dropdown.Item>
                <Dropdown.Item
                    eventKey="2"
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <MokaInput
                        as="checkbox"
                        // id={`type-check-${menu.name}`}
                        id={`type-check-id`}
                        // key={menu.cd}
                        // value={menu.name}
                        onChange={(e) => {
                            if (e.target.checked) {
                                // setValue([...value, e.target.value]);
                                setCount(count + 1);
                            } else {
                                setCount(count - 1);
                            }
                        }}
                        inputProps={{ label: '테스트', custom: true }}
                    />
                </Dropdown.Item>
                <Dropdown.Item eventKey="3">
                    <MokaInput
                        as="checkbox"
                        // id={`type-check-${menu.name}`}
                        // id={`type-check-id`}
                        // key={menu.cd}
                        // value={menu.name}
                        // onChange={(e) => {
                        //     if (e.target.checked) {
                        //         setValue([...value, e.target.value]);
                        //         setCount(count + 1);
                        //     } else {
                        //         setCount(count - 1);
                        //     }
                        // }}
                        inputProps={{ label: '테스트', custom: true }}
                    />
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

// EditThumbSelectDropdown.propTypes = propTypes;
// EditThumbSelectDropdown.defaultProps = defaultProps;

export default EditThumbSelectDropdown;
