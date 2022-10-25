import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { CaretDown } from 'react-bootstrap-icons';
import SummaryText from './SummaryText';
import LessonItem from './LessonItem';

const ClassesCourseItem = ({ eventKey, session, lessons }) => {
  const decoratedOnClick = useAccordionButton(eventKey);

  return (
    <Card className="my-4">
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke' } : { backgroundColor: '#fbfbfb' }}>
        <Row>
          <Col xs={10} md={11}>
            <h3 style={{ display: 'inline', marginRight: '0.5em' }}>
              {session.title}
            </h3>
            <h5 style={{ display: 'inline-block' }}>
              {session.difficulty === 'Basic' ? <Badge bg="success">{session.difficulty}</Badge> : ''}
              {session.difficulty === 'Intermediate' ? <Badge bg="warning">{session.difficulty}</Badge> : ''}
              {session.difficulty === 'Advanced' ? <Badge bg="danger">{session.difficulty}</Badge> : ''}
            </h5>
          </Col>
          <Col xs={2} md={1} className="text-end">
            <Button variant="outline-secondary" type="button" onClick={decoratedOnClick} size="sm"><CaretDown /></Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <SummaryText summary={session.summary} eventKey={eventKey} textLen={300} />
          </Col>
        </Row>
        <Row>
          <Col>
            {session.tags.map((tag, index) => (
              <span key={index}>
                <Badge pill bg="primary">
                  {tag}
                </Badge>{' '}
              </span>
            ))}
          </Col>
        </Row>
      </Card.Header>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          <h4>Lessons</h4>
          <hr />
          <Accordion>
            {lessons.length === 0 ? <p>Please check back soon when new lessons are posted for this course!</p> : lessons.map((lesson, index) => <LessonItem key={index} eventKey={index} lesson={lesson} />)}
          </Accordion>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

ClassesCourseItem.propTypes = {
  eventKey: PropTypes.number.isRequired,
  session: PropTypes.shape.isRequired,
  lessons: PropTypes.shape.isRequired,
};

export default ClassesCourseItem;
