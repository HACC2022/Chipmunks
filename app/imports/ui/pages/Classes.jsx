import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Container, Button, Table, ListGroup, InputGroup, Form, Accordion, Card, Tabs, Tab } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Search } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Sessions } from '../../api/session/SessionCollection';
import { Lessons } from '../../api/lesson/LessonCollection';
import { ROLE } from '../../api/role/Role';
import CreateSessionModal from '../components/session/CreateSessionModal';
import CreateLessonModal from '../components/lesson/CreateLessonModal';
import LoadingSpinner from '../components/LoadingSpinner';
import LessonItem from '../components/LessonItem';
import ClassesEventItem from '../components/classes/ClassesEventItem';
import ClassesCourseItem from '../components/classes/ClassesCourseItem';

const Classes = () => {
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showCreateLesson, setShowCreateLesson] = useState(false);

  const { ready, sessions, lessons } = useTracker(() => {
    const subscription1 = Sessions.subscribeSession();
    const subscription2 = Lessons.subscribeLesson();

    const rdy = subscription1.ready() && subscription2.ready();

    const sessionItems = Sessions.find({}, {}).fetch();
    const lessonItems = Lessons.find({}, {}).fetch();
    return {
      sessions: sessionItems,
      lessons: lessonItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.CLASSES_PAGE} className="py-3">
      <h1>Classes</h1>
      { Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
        <div>
          <Button variant="outline-primary" type="button" onClick={() => setShowCreateSession(true)}>Create Course / Event</Button>
          <Button variant="outline-primary" type="button" onClick={() => setShowCreateLesson(true)}>Create Lesson</Button>

          <CreateSessionModal modal={{ show: showCreateSession, setShow: setShowCreateSession }} />
          <CreateLessonModal lessonModal={{ show: showCreateLesson, setShow: setShowCreateLesson }} sessionModal={{ show: showCreateSession, setShow: setShowCreateSession }} />
        </div>
      ) : ''}

      <Card>
        <ListGroup variant="flush">
          <ListGroup.Item className="p-4">
            <InputGroup>
              <InputGroup.Text style={{ border: 'none' }}><Search /></InputGroup.Text>
              <Form.Control
                id="account-list-search"
                type="search"
                placeholder="Search"
                style={{ backgroundColor: '#e9ecef', border: 'none' }}
                autoComplete="off"
              />
              <Button variant="dark" type="button" style={{ marginLeft: '2em' }}>Search Classes</Button>
            </InputGroup>
          </ListGroup.Item>
          <ListGroup.Item className="p-4">
            <Tabs
              defaultActiveKey="courses"
              className="mb-3"
              justify
            >
              <Tab eventKey="courses" title="Courses">
                <Accordion>
                  {_.where(sessions, { type: 'Course' }).map((course, index) => <ClassesCourseItem key={index} eventKey={index} session={course} lessons={_.where(lessons, { sessionID: course._id })} />)}
                </Accordion>
              </Tab>
              <Tab eventKey="events" title="Events">
                {_.where(sessions, { type: 'Event' }).map((event, index) => <ClassesEventItem key={index} eventKey={index} session={event} />)}
              </Tab>
            </Tabs>
            <Accordion />
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Container>
  ) : <LoadingSpinner message="Loading Classes" />);
};

export default Classes;
