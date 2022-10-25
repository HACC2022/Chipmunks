import React from 'react';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { Accordion, Button, Card, Col, Row } from 'react-bootstrap';
import { CaretDown } from 'react-bootstrap-icons';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import SummaryText from './SummaryText';

const LessonItem = ({ eventKey, lesson }) => {
  const decoratedOnClick = useAccordionButton(`lesson-${eventKey}`);

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col sm={3} md={2} lg={1}>
            <b>{`Lesson ${eventKey + 1}:`}</b>
          </Col>
          <Col>
            <b>{lesson.title}</b>
          </Col>
          <Col sm={2} md={1} className="text-end">
            <Button variant="outline-secondary" type="button" onClick={decoratedOnClick} size="sm" style={{ padding: '0 0.2em 0 0.2em' }}><CaretDown /></Button>
          </Col>
        </Row>
      </Card.Header>
      <Accordion.Collapse eventKey={`lesson-${eventKey}`}>
        <Card.Body style={{ border: '1px solid lightgray' }}>
          <Row>
            <Col><SummaryText summary={lesson.summary} eventKey={eventKey} textLen={100} /></Col>
          </Row>
          <Row>
            <Col className="text-end">
              <Button variant="outline-primary" type="button" size="sm">Begin Lesson</Button>{' '}
              {lesson.quiz.length > 0 ? <Button variant="outline-danger" type="button" size="sm">Take Quiz</Button> : ''}{' '}
              <Button variant="outline-success" type="button" size="sm">Register for Lesson</Button>
            </Col>
          </Row>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );

};

LessonItem.propTypes = {
  eventKey: PropTypes.number.isRequired,
  lesson: PropTypes.shape.isRequired,
};

export default LessonItem;
