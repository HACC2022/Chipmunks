import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import { Form, Modal, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { PlusLg, XLg, ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import Select from 'react-select';
import swal from 'sweetalert';
import { Sessions } from '../../../api/session/SessionCollection';
import { Lessons, selectSessionSetup } from '../../../api/lesson/LessonCollection';
import { COMPONENT_IDS } from '../../utilities/ComponentIDs';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const CreateLessonModal = ({ lessonModal, sessionModal }) => {
  const formGroupStyle = { marginTop: '20px' };

  const [update, setUpdate] = useState(0);
  const [lesson, setLesson] = useState({ sessionID: '', title: '', summary: '', videoLink: '' });
  const [lessonContent, setLessonContent] = useState([]);
  const [quizContent, setQuizContent] = useState([]);

  const { sessionOptions, ready } = useTracker(() => {
    const sessionSubscription = Sessions.subscribeSession();
    const rdy = sessionSubscription.ready();
    const session = Sessions.find({ type: 'Course' }, { sort: { title: 1 } }).fetch();
    const sessionFilter = [];
    selectSessionSetup(sessionFilter, session);
    return {
      ready: rdy,
      sessionOptions: sessionFilter,
    };
  }, []);

  const switchModal = () => {
    lessonModal.setShow(false);
    sessionModal.setShow(true);
  };

  const updateLesson = (event, property) => {
    if (property === 'sessionID') {
      setLesson(prevLesson => ({ ...prevLesson, [property]: event.value }));
    } else {
      setLesson(prevLesson => ({ ...prevLesson, [property]: event }));
    }
  };

  const addLessonContent = () => {
    const content = { key: lessonContent.length, header: '', body: '' };
    const temp = lessonContent;
    temp.push(content);
    setLessonContent(temp);
    setUpdate(update + 1);
  };

  const deleteLessonContent = (index) => {
    const temp = lessonContent;
    temp.splice(index, 1);
    temp.forEach((item, i) => {
      temp[i].key = i;
    });
    setLessonContent(temp);
    setUpdate(update + 1);
  };

  const updateLessonContent = (text, type, index) => {
    const temp = lessonContent;
    temp[index][type] = text;
    setLessonContent(temp);
    setUpdate(update + 1);
  };

  const reorderLessonContent = (direction, index) => {
    const temp = lessonContent;
    if (index !== 0 && direction === 'up') {
      const temp2 = temp[index - 1];
      temp[index - 1] = temp[index];
      temp[index] = temp2;
      temp[index - 1].key = index - 1;
      temp[index].key = index;
    }
    if (index !== lessonContent.length - 1 && direction === 'down') {
      const temp2 = temp[index + 1];
      temp[index + 1] = temp[index];
      temp[index] = temp2;
      temp[index + 1].key = index + 1;
      temp[index].key = index;
    }
    setLessonContent(temp);
    setUpdate(update + 1);
  };

  const addQuizQuestion = () => {
    const content = { key: quizContent.length, question: '', options: { a: '', b: '', c: '', d: '' }, correct: 0, feedback: '' };
    const temp = quizContent;
    temp.push(content);
    setQuizContent(temp);
    setUpdate(update + 1);
  };

  const deleteQuizQuestion = (index) => {
    const temp = quizContent;
    temp.splice(index, 1);
    temp.forEach((item, i) => {
      temp[i].key = i;
    });
    setQuizContent(temp);
    setUpdate(update + 1);
  };

  const resetCheckboxes = (index) => {
    document.getElementById(`question-${index + 1}-checkbox-a`).checked = false;
    document.getElementById(`question-${index + 1}-checkbox-b`).checked = false;
    document.getElementById(`question-${index + 1}-checkbox-c`).checked = false;
    document.getElementById(`question-${index + 1}-checkbox-d`).checked = false;
    document.getElementById(`question-${index + 1}-option-a`).style.backgroundColor = 'white';
    document.getElementById(`question-${index + 1}-option-b`).style.backgroundColor = 'white';
    document.getElementById(`question-${index + 1}-option-c`).style.backgroundColor = 'white';
    document.getElementById(`question-${index + 1}-option-d`).style.backgroundColor = 'white';
  };

  const updateQuizQuestion = (text, type, index) => {
    const temp = quizContent;
    if (type === 'question' || type === 'feedback') {
      temp[index][type] = text;
    } else if (type === 'a' || type === 'b' || type === 'c' || type === 'd') {
      temp[index].options[type] = text;
    } else {
      resetCheckboxes(index);
      document.getElementById(`question-${index + 1}-${type}`).checked = true;
      if (type === 'checkbox-a') {
        document.getElementById(`question-${index + 1}-option-a`).style.backgroundColor = '#bdf4bd';
        temp[index].correct = 0;
      }
      if (type === 'checkbox-b') {
        document.getElementById(`question-${index + 1}-option-b`).style.backgroundColor = '#bdf4bd';
        temp[index].correct = 1;
      }
      if (type === 'checkbox-c') {
        document.getElementById(`question-${index + 1}-option-c`).style.backgroundColor = '#bdf4bd';
        temp[index].correct = 2;
      }
      if (type === 'checkbox-d') {
        document.getElementById(`question-${index + 1}-option-d`).style.backgroundColor = '#bdf4bd';
        temp[index].correct = 3;
      }
    }
    setQuizContent(temp);
    setUpdate(update + 1);
  };

  const back = () => {
    document.getElementById('create-lesson-back').setAttribute('hidden', true);
    document.getElementById('create-lesson-back').setAttribute('aria-hidden', true);
    document.getElementById('create-lesson-submit').setAttribute('hidden', true);
    document.getElementById('create-lesson-submit').setAttribute('aria-hidden', true);
    document.getElementById('create-lesson-next').removeAttribute('hidden');
    document.getElementById('create-lesson-next').removeAttribute('aria-hidden');

    document.getElementById('create-lesson-quiz-header').innerText = 'Create Lesson';
    document.getElementById('lesson-section').style.display = 'block';
    document.getElementById('quiz-section').style.display = 'none';
  };

  const next = () => {
    document.getElementById('create-lesson-back').removeAttribute('hidden');
    document.getElementById('create-lesson-back').removeAttribute('aria-hidden');
    document.getElementById('create-lesson-submit').removeAttribute('hidden');
    document.getElementById('create-lesson-submit').removeAttribute('aria-hidden');
    document.getElementById('create-lesson-next').setAttribute('hidden', true);
    document.getElementById('create-lesson-next').setAttribute('aria-hidden', true);

    document.getElementById('create-lesson-quiz-header').innerText = 'Create Quiz (optional)';
    document.getElementById('lesson-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
  };

  const submit = () => {
    const { sessionID, title, summary, videoLink } = lesson;
    const owner = Meteor.user().username;
    const collectionName = Lessons.getCollectionName();
    const lessonText = [];
    const quiz = [];
    lessonContent.forEach((item) => {
      lessonText.push({ header: item.header, body: item.body });
    });
    quizContent.forEach((item) => {
      const options = [];
      options.push(item.options.a);
      options.push(item.options.b);
      options.push(item.options.c);
      options.push(item.options.d);
      quiz.push({ question: item.question, options: options, correct: item.correct, feedback: item.feedback });
    });
    const definitionData = { sessionID, title, summary, videoLink, owner, lessonText, quiz };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(err => {
        swal('Error', err.message, 'error');
        throw err;
      })
      .then(() => {
        swal('Success', 'Lesson added successfully', 'success');
        setLessonContent([]);
        setQuizContent([]);
        setLesson({ sessionID: sessionID, title: '', summary: '', videoLink: '' });
        setUpdate(0);
        lessonModal.setShow(false);
      });
  };

  return ready ? (
    <Modal
      id={COMPONENT_IDS.CLASSES_CREATE_LESSON_MODAL}
      show={lessonModal.show}
      onHide={() => lessonModal.setShow(false)}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-90w"
      centered
    >
      <Modal.Header closeButton>
        <h2 id="create-lesson-quiz-header">Create Lesson</h2>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
        <Form>
          <div id="lesson-section">
            <Form.Group>
              <Form.Label>Select Course: *</Form.Label>
              <Select options={sessionOptions} onChange={(e) => updateLesson(e, 'sessionID')} />
              <Form.Text style={{ float: 'right' }}>Don&apos;t see your course? You can add a course <span style={{ textDecoration: 'underline', color: 'blue' }} onClick={switchModal} onKeyDown={switchModal} role="button" tabIndex="0">here!</span>
              </Form.Text>
            </Form.Group>
            <Form.Group style={formGroupStyle}>
              <Form.Label required>Title: *</Form.Label>
              <Form.Control value={lesson.title} type="title" placeholder="" onChange={(e) => updateLesson(e.target.value, 'title')} autoComplete="off" />
              <div className="valid-feedback">
                Looks good!
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Video Link: </Form.Label>
              <Form.Control value={lesson.videoLink} type="videoLink" placeholder="" onChange={(e) => updateLesson(e.target.value, 'videoLink')} autoComplete="off" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Summary: *</Form.Label>
              <Form.Control as="textarea" value={lesson.summary} type="summary" placeholder="" onChange={(e) => updateLesson(e.target.value, 'summary')} autoComplete="off" />
            </Form.Group>

            <h5 style={formGroupStyle}>Lesson Content</h5>
            { lessonContent.map((item, index) => (
              <Form.Group key={index} style={{ marginBottom: '20px' }}>
                <Row>
                  <Col>
                    <Form.Control id={`lessonContent-header-${index}`} type="header" placeholder="Header" size="lg" onChange={(event) => updateLessonContent(event.target.value, 'header', index)} value={item.header} autoComplete="off" />
                  </Col>
                  <Col xs={3} className="text-end">
                    <ChevronUp className="mx-2" onClick={() => reorderLessonContent('up', index)} role="button" />
                    <ChevronDown className="mx-2" onClick={() => reorderLessonContent('down', index)} role="button" />
                    <Button variant="outline-danger" size="sm" type="button" onClick={() => deleteLessonContent(index)}><XLg /></Button>
                  </Col>
                </Row>
                <Row>
                  <Col><Form.Control id={`lessonContent-body-${index}`} as="textarea" type="body" placeholder="Body" onChange={(event) => updateLessonContent(event.target.value, 'body', index)} value={item.body} autoComplete="off" /></Col>
                </Row>
              </Form.Group>
            )) }
            <Button variant="outline-primary" type="button" onClick={addLessonContent}><PlusLg /><span style={{ marginLeft: '10px' }}>Add Section</span></Button>
          </div>
          <div id="quiz-section" style={{ display: 'none' }}>
            <p style={{ color: 'gray' }}>If you do not wish to attach a quiz to this lesson, you may skip this step.</p>
            { quizContent.map((item, index) => ([
              <Form.Group style={{ marginBottom: '10px', marginTop: '20px' }}>
                <Row>
                  <Col><Form.Label><b>{`Question ${index + 1}`}</b></Form.Label></Col>
                  <Col xs={2} className="text-end">
                    <Button variant="outline-danger" size="sm" type="button" onClick={() => deleteQuizQuestion(index)}><XLg /></Button>
                  </Col>
                </Row>
                <Form.Control as="textarea" type="question" placeholder="" value={item.question} onChange={(e) => updateQuizQuestion(e.target.value, 'question', index)} autoComplete="off" />
              </Form.Group>,
              <Col xs={10}>
                <InputGroup>
                  <InputGroup.Text style={{ width: '40px' }}>A</InputGroup.Text>
                  <Form.Control
                    id={`question-${index + 1}-option-a`}
                    placeholder="Option A"
                    aria-label="Option A"
                    value={item.options.a}
                    onChange={(e) => updateQuizQuestion(e.target.value, 'a', index)}
                    style={item.correct === 0 ? { backgroundColor: '#bdf4bd' } : { backgroundColor: 'white' }}
                    autoComplete="off"
                  />
                  <InputGroup.Radio id={`question-${index + 1}-checkbox-a`} aria-label="Checkbox for following text input" onChange={(e) => updateQuizQuestion(e.target.checked, 'checkbox-a', index)} checked={item.correct === 0} />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text style={{ width: '40px' }}>B</InputGroup.Text>
                  <Form.Control
                    id={`question-${index + 1}-option-b`}
                    placeholder="Option B"
                    aria-label="Option B"
                    value={item.options.b}
                    onChange={(e) => updateQuizQuestion(e.target.value, 'b', index)}
                    style={item.correct === 1 ? { backgroundColor: '#bdf4bd' } : { backgroundColor: 'white' }}
                    autoComplete="off"
                  />
                  <InputGroup.Radio id={`question-${index + 1}-checkbox-b`} aria-label="Checkbox for following text input" onChange={(e) => updateQuizQuestion(e.target.checked, 'checkbox-b', index)} checked={item.correct === 1} />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text style={{ width: '40px' }}>C</InputGroup.Text>
                  <Form.Control
                    id={`question-${index + 1}-option-c`}
                    placeholder="Option C"
                    aria-label="Option C"
                    value={item.options.c}
                    onChange={(e) => updateQuizQuestion(e.target.value, 'c', index)}
                    style={item.correct === 2 ? { backgroundColor: '#bdf4bd' } : { backgroundColor: 'white' }}
                    autoComplete="off"
                  />
                  <InputGroup.Radio id={`question-${index + 1}-checkbox-c`} aria-label="Checkbox for following text input" onChange={(e) => updateQuizQuestion(e.target.checked, 'checkbox-c', index)} checked={item.correct === 2} />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text style={{ width: '40px' }}>D</InputGroup.Text>
                  <Form.Control
                    id={`question-${index + 1}-option-d`}
                    placeholder="Option D"
                    aria-label="Option D"
                    value={item.options.d}
                    onChange={(e) => updateQuizQuestion(e.target.value, 'd', index)}
                    style={item.correct === 3 ? { backgroundColor: '#bdf4bd' } : { backgroundColor: 'white' }}
                    autoComplete="off"
                  />
                  <InputGroup.Radio id={`question-${index + 1}-checkbox-d`} aria-label="Checkbox for following text input" onChange={(e) => updateQuizQuestion(e.target.checked, 'checkbox-d', index)} checked={item.correct === 3} />
                </InputGroup>
                <Form.Control className="my-2" type="feedback" placeholder="Question Feedback (optional)" onChange={(e) => updateQuizQuestion(e.target.value, 'feedback', index)} value={item.feedback} autoComplete="off" />
              </Col>,
            ])) }
            <Button variant="outline-primary" type="button" onClick={addQuizQuestion} style={{ marginTop: '20px' }}><PlusLg /><span style={{ marginLeft: '10px' }}>Add Quiz Question</span></Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button hidden aria-hidden id="create-lesson-back" type="button" onClick={back} variant="primary" style={{ position: 'absolute', left: '1em' }}>Back</Button>
        <Button variant="secondary" type="button" onClick={() => lessonModal.setShow(false)}>Cancel</Button>
        <Button id="create-lesson-next" type="button" onClick={next} variant="primary" className="mx-3">Next</Button>
        <Button hidden aria-hidden id="create-lesson-submit" type="button" onClick={submit} variant="primary" className="mx-3">Create Lesson</Button>
      </Modal.Footer>
    </Modal>
  ) : '';
};

CreateLessonModal.propTypes = {
  lessonModal: PropTypes.shape({
    show: PropTypes.bool,
    setShow: PropTypes.func,
  }).isRequired,
  sessionModal: PropTypes.shape({
    show: PropTypes.bool,
    setShow: PropTypes.func,
  }).isRequired,
};

export default CreateLessonModal;
