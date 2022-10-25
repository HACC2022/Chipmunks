import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Button, Card, Col, Row, Badge } from 'react-bootstrap';
import SummaryText from './SummaryText';

const ClassesEventItem = ({ eventKey, session }) => (
  <Card className="my-4">
    <Card.Body style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke' } : { backgroundColor: '#fbfbfb' }}>
      <Row>
        <Col xs={8}>
          <h3 style={{ display: 'inline', marginRight: '0.5em' }}>
            {session.title}
          </h3>
          <h5 style={{ display: 'inline-block' }}>
            {session.difficulty === 'Basic' ? <Badge bg="success">{session.difficulty}</Badge> : ''}
            {session.difficulty === 'Intermediate' ? <Badge bg="warning">{session.difficulty}</Badge> : ''}
            {session.difficulty === 'Advanced' ? <Badge bg="danger">{session.difficulty}</Badge> : ''}
          </h5>
        </Col>
        <Col className="text-end" xs={4}>
          <span className="px-4">{session.date ? session.date.toLocaleDateString() : ''}</span>
          <span>{session.date ? `${session.startTime} - ${session.endTime}` : ''}</span>
          <p><b>Location: </b>{session.location}</p>
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
        <Col className="text-end">
          <Button variant="outline-success" type="button">Register for Event</Button>
        </Col>
      </Row>
    </Card.Body>
    <Accordion.Collapse eventKey={eventKey}>
      <Card.Body style={{ border: '1px solid lightgray' }}>
        test
      </Card.Body>
    </Accordion.Collapse>
  </Card>
);

ClassesEventItem.propTypes = {
  eventKey: PropTypes.number.isRequired,
  session: PropTypes.shape.isRequired,
};

export default ClassesEventItem;
