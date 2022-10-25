import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Container, Button, ListGroup, InputGroup, Form, Accordion, Card, Tabs, Tab, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight, Search, Book } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Sessions } from '../../api/session/SessionCollection';
import { Lessons } from '../../api/lesson/LessonCollection';
import { ROLE } from '../../api/role/Role';
import CreateSessionModal from '../components/session/CreateSessionModal';
import CreateLessonModal from '../components/lesson/CreateLessonModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ClassesEventItem from '../components/classes/ClassesEventItem';
import ClassesCourseItem from '../components/classes/ClassesCourseItem';

const Classes = () => {
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [classTab, setClassTab] = useState('Courses');
  const [search, setSearch] = useState('');
  const [itemsPerCoursePage, setItemsPerCoursePage] = useState(10);
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [itemsPerEventPage, setItemsPerEventPage] = useState(10);
  const [currentEventPage, setCurrentEventPage] = useState(1);

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

  let filteredCourses;
  let filteredEvents;
  let numCourses;
  let numEvents;
  let numCoursePages;
  let numEventPages;

  if (ready) {
    const courses = _.where(sessions, { type: 'Course' });
    filteredCourses = courses.filter(post => {
      if (search === '') {
        return post;
      }
      if (post.title.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      if (post.summary.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      if (post.type.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      if (_.contains(post.tags, `${search.substring(0, 1).toUpperCase()}${search.substring(1).toLowerCase()}`)) {
        return post;
      }
      return undefined;
    });
    numCourses = _.size(filteredCourses);
    numCoursePages = parseInt(numCourses / itemsPerCoursePage, 10);
    if (numCourses % itemsPerCoursePage !== 0) {
      numCoursePages++;
    }
  }

  if (ready) {
    const events = _.where(sessions, { type: 'Event' });
    filteredEvents = events.filter(post => {
      if (search === '') {
        return post;
      }
      if (post.title.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      if (post.summary.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      if (post.type.toLowerCase().includes(search.toLowerCase())) {
        return post;
      }
      if (_.contains(post.tags, `${search.substring(0, 1).toUpperCase()}${search.substring(1).toLowerCase()}`)) {
        return post;
      }
      return undefined;
    });
    numEvents = _.size(filteredEvents);
    numEventPages = parseInt(numEvents / itemsPerEventPage, 10);
    if (numEvents % itemsPerEventPage !== 0) {
      numEventPages++;
    }
  }

  const getFilteredCourses = () => {
    const startIndex = (+currentCoursePage * +itemsPerCoursePage) - +itemsPerCoursePage;
    const endIndex = +startIndex + +itemsPerCoursePage;
    let ret;
    if (endIndex < numCourses) {
      ret = filteredCourses.slice(startIndex, endIndex);
    } else {
      ret = filteredCourses.slice(startIndex, numCourses);
    }
    return ret;
  };

  const getFilteredEvents = () => {
    const startIndex = (+currentEventPage * +itemsPerEventPage) - +itemsPerEventPage;
    const endIndex = +startIndex + +itemsPerEventPage;
    let ret;
    if (endIndex < numEvents) {
      ret = filteredEvents.slice(startIndex, endIndex);
    } else {
      ret = filteredEvents.slice(startIndex, numEvents);
    }
    return ret;
  };

  // Pagination stuff
  const getItemsPerPage = () => {
    const selection = document.getElementById('pagination-items-per-page').value;
    if (classTab === 'Courses') {
      setItemsPerCoursePage(+selection);
      setCurrentCoursePage(1);
    } else {
      setItemsPerEventPage(+selection);
      setCurrentEventPage(1);
    }
    document.getElementById('pagination-select-page').value = 1;
  };
  const getItemsInPage = () => {
    const selection = document.getElementById('pagination-select-page').value;
    if (classTab === 'Courses') {
      setCurrentCoursePage(+selection);
    } else {
      setCurrentEventPage(+selection);
    }
  };
  const goToFirstPage = () => {
    document.getElementById('pagination-select-page').value = 1;
    if (classTab === 'Courses') {
      setCurrentCoursePage(1);
    } else {
      setCurrentEventPage(1);
    }
  };
  const goToPrevPage = () => {
    if (classTab === 'Courses' && currentCoursePage !== 1) {
      document.getElementById('pagination-select-page').value = currentCoursePage - 1;
      setCurrentCoursePage(+currentCoursePage - 1);
    }
    if (classTab === 'Events' && currentEventPage !== 1) {
      document.getElementById('pagination-select-page').value = currentEventPage - 1;
      setCurrentEventPage(+currentEventPage - 1);
    }
  };
  const goToLastPage = () => {
    if (classTab === 'Courses') {
      document.getElementById('pagination-select-page').value = numCoursePages;
      setCurrentCoursePage(numCoursePages);
    } else {
      document.getElementById('pagination-select-page').value = numEventPages;
      setCurrentEventPage(numEventPages);
    }
  };
  const goToNextPage = () => {
    if (classTab === 'Courses' && currentCoursePage !== numCoursePages) {
      document.getElementById('pagination-select-page').value = currentCoursePage + 1;
      setCurrentCoursePage(+currentCoursePage + 1);
    }
    if (classTab === 'Events' && currentEventPage !== numEventPages) {
      document.getElementById('pagination-select-page').value = currentEventPage + 1;
      setCurrentEventPage(+currentEventPage + 1);
    }
  };
  const handleSearch = (e) => {
    if (e.type === 'keyup' && e.code !== 'Enter') {
      return;
    }
    document.getElementById('pagination-select-page').value = 1;
    setCurrentCoursePage(1);
    setCurrentEventPage(1);
    setSearch(document.getElementById('classes-search').value);
  };

  return (ready ? (
    <Container id={PAGE_IDS.CLASSES_PAGE} className="py-3">
      { Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
        <Row>
          <Col xs={4}>
            <h1><Book style={{ marginRight: '1em' }} />Classes</h1>
          </Col>
          <Col>
            <div className="text-end">
              <Button variant="outline-primary" type="button" onClick={() => setShowCreateSession(true)}>Create Course / Event</Button>{' '}
              <Button variant="outline-primary" type="button" onClick={() => setShowCreateLesson(true)}>Create Lesson</Button>
            </div>
          </Col>
          <CreateSessionModal modal={{ show: showCreateSession, setShow: setShowCreateSession }} />
          <CreateLessonModal lessonModal={{ show: showCreateLesson, setShow: setShowCreateLesson }} sessionModal={{ show: showCreateSession, setShow: setShowCreateSession }} />
        </Row>
      ) : <h1><Book style={{ marginRight: '1em' }} />Classes</h1>}

      <Card className="mt-4">
        <ListGroup variant="flush">
          <ListGroup.Item className="p-4">
            <InputGroup>
              <InputGroup.Text style={{ border: 'none' }}><Search /></InputGroup.Text>
              <Form.Control
                id="classes-search"
                type="search"
                placeholder="Search"
                style={{ backgroundColor: '#e9ecef', border: 'none' }}
                autoComplete="off"
                onKeyUp={(e) => handleSearch(e)}
              />
              <Button variant="dark" type="button" style={{ marginLeft: '2em' }} onClick={(e) => handleSearch(e)}>Search Classes</Button>
            </InputGroup>
          </ListGroup.Item>
          <ListGroup.Item className="p-4">
            <Tabs
              defaultActiveKey="courses"
              className="mb-3"
              justify
              onClick={(e) => {
                setClassTab(e.target.innerHTML);
                setCurrentEventPage(1);
                setCurrentCoursePage(1);
                setItemsPerEventPage(10);
                setItemsPerCoursePage(10);
                document.getElementById('pagination-items-per-page').value = 10;
              }}
            >
              <Tab eventKey="courses" title="Courses">
                <Accordion>
                  {getFilteredCourses().map((course, index) => <ClassesCourseItem key={index} eventKey={index} session={course} lessons={_.where(lessons, { sessionID: course._id })} />)}
                </Accordion>
              </Tab>
              <Tab eventKey="events" title="Events">
                {getFilteredEvents().map((event, index) => <ClassesEventItem key={index} eventKey={index} session={event} />)}
              </Tab>
            </Tabs>
            <Accordion />
          </ListGroup.Item>
          <ListGroup.Item>
            <Row className="d-flex flex-row-reverse">
              <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToLastPage}>
                <ChevronDoubleRight />
              </Button>
              <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToNextPage}>
                <ChevronRight />
              </Button>
              <Form.Select id="pagination-select-page" style={{ width: '90px' }} onChange={getItemsInPage}>
                {classTab === 'Courses' ? [...Array(numCoursePages)].map((e, i) => <option value={i + 1} key={i}>{i + 1}</option>) : [...Array(numEventPages)].map((e, i) => <option value={i + 1} key={i}>{i + 1}</option>)}
              </Form.Select>
              <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToPrevPage}>
                <ChevronLeft />
              </Button>
              <Button variant="outline-light" style={{ width: '50px', color: 'black' }} onClick={goToFirstPage}>
                <ChevronDoubleLeft />
              </Button>
              <Form.Select id="pagination-items-per-page" style={{ width: '80px', marginRight: '3em' }} onChange={getItemsPerPage}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </Form.Select>
              <Form.Label style={{ width: 'fit-content', marginTop: '0.5em', color: 'gray' }}>Items Per Page:</Form.Label>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Container>
  ) : <LoadingSpinner message="Loading Classes" />);
};

export default Classes;
