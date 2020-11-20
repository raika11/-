import React, { forwardRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import TaskComponent from './TaskComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@moka/fontawesome-pro-solid-svg-icons';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const IconToggle = forwardRef(({ children, onClick }, ref) => (
    <a
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        <FontAwesomeIcon icon={faEllipsisH} fixedWidth />
    </a>
));

const IconMenu = forwardRef(({ children, style, className }, ref) => {
    return (
        <div ref={ref} style={style} className={className}>
            <ul className="list-unstyled">{children}</ul>
        </div>
    );
});

const IconDropButton = () => (
    <Dropdown>
        <Dropdown.Toggle as={IconToggle} />
        <Dropdown.Menu as={IconMenu}>
            <Dropdown.Item eventKey="1">Red</Dropdown.Item>
            <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
            <Dropdown.Item eventKey="3" active>
                Orange
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
);

// const Task = ({ id, index, content }) => (
//     <Draggable draggableId={id} index={index}>
//         {(provided, snapshot) => (
//             <Card
//                 className="my-3 bg-light border"
//                 ref={provided.innerRef}
//                 {...provided.draggableProps}
//                 {...provided.dragHandleProps}
//             >
//                 <Card.Body className="p-3">
//                     <Form.Check type="checkbox" className="float-right" />
//                     <p>{content}</p>
//                     <Image
//                         src={avatar}
//                         style={{ width: '32px', height: '32px' }}
//                         roundedCircle
//                         className="float-right"
//                     />
//                     <Button variant="primary" size="sm">
//                         View
//                     </Button>
//                 </Card.Body>
//             </Card>
//         )}
//     </Draggable>
// );

// );
//     return (
//       <Fragment>
//         <Container>
//           <h1>{props.column.title}</h1>
//           <Droppable droppableId={props.column.id} type="TASK">
//             {(provided, snapshot) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 /* isDraggingOver={snapshot.isDraggingOver} */
//               >
//                 {props.tasks.map((task, index) => (
//                   <Task key={task.id} task={task} index={index} />
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </Container>
//       </Fragment>
//     )
//   }

// // 보기좋게 앱을 만드는 인라인 스타일 헬퍼
// const grid = 8;
// const getItemStyle = (draggableStyle, isDragging) => ({
//     // 아이템을 보기 좋게 만드는 몇 가지 기본 스타일
//     userSelect: 'none',
//     padding: grid * 2,
//     marginBottom: grid,

//     // 드래깅시 배경색 변경
//     background: isDragging ? 'lightgreen' : 'grey',

//     // 드래그에 필요한 스타일 적용
//     ...draggableStyle,
// });
// const getListStyle = (isDraggingOver) => ({
//     background: isDraggingOver ? 'lightblue' : 'lightgrey',
//     padding: grid,
//     width: 250,
// });

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
});

const TasksPage = () => {
    const items = [
        { id: 'item-0', content: '111111111111' },
        { id: 'item-1', content: '222222222222' },
        { id: 'item-2', content: '333333333333' },
        { id: 'item-3', content: '444444444444' },
        { id: 'item-4', content: '555555555555' },
        { id: 'item-5', content: '666666666666' },
        { id: 'item-6', content: '777777777777' },
        { id: 'item-7', content: '888888888888' },
        { id: 'item-8', content: '999999999999' },
        { id: 'item-9', content: '101010101010' },
        { id: 'item-10', content: '1/1111111111' },
        { id: 'item-11', content: '1/2222222222' },
        { id: 'item-12', content: '1/3333333333' },
    ];

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        //   const quotes = reorder(
        //     state.quotes,
        //     result.source.index,
        //     result.destination.index
        //   );

        //   setState({ quotes });
    };

    return (
        <Container>
            <h1>Tasks</h1>
            <Row>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                <div>Upcomings</div>
                                <IconDropButton />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nam pretium turpis et arcu. Duis arcu.</Card.Subtitle>
                            <TaskComponent text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <TaskComponent text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <TaskComponent text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <TaskComponent text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                In Progress
                                <IconDropButton />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nam pretium turpis et arcu. Duis arcu.</Card.Subtitle>
                            {/* <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." /> */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                On Hold
                                <IconDropButton />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nam pretium turpis et arcu. Duis arcu.</Card.Subtitle>
                            {/* <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." /> */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                Completed
                                <IconDropButton />
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Nam pretium turpis et arcu. Duis arcu.</Card.Subtitle>
                            {/* <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." />
                            <Task text="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada." /> */}
                            {/* <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided, snapshot) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                            {items.map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                        >
                                                            {item.content}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext> */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TasksPage;
