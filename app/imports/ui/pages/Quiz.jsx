import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import { Navigate, useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Lessons } from '../../api/lesson/LessonCollection';
import { SubmittedQuizzes } from '../../api/submittedQuiz/SubmittedQuizCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';

const QuizQuestion = ({ quizItem, index, setAnswer }) => {
  const getOption = () => {
    const ele = document.getElementsByName(`question-${index}`);

    ele.forEach((option) => {
      if (option.checked) {
        setAnswer(index, option.value);
      }
    });
  };

  return (
    <div className="my-5">
      <h3>{`${index + 1}. ${quizItem.question}`}</h3>
      <Form onChange={getOption}>
        {quizItem.options.map((option, i) => (
          <Form.Check id={`question-${index}-option-${i}`} key={i} name={`question-${index}`} type="radio" label={option} value={i} />
        ))}
      </Form>
    </div>
  );
};

QuizQuestion.propTypes = {
  quizItem: PropTypes.shape.isRequired,
  index: PropTypes.number.isRequired,
  setAnswer: PropTypes.func.isRequired,
};

const Quiz = () => {
  const { _id } = useParams();
  const [redirect, setRedirect] = useState('');
  const answers = [];

  const { ready, lesson, quizExists, user, username } = useTracker(() => {
    const usrname = Meteor.user() ? Meteor.user().username : '';
    const subscription1 = Lessons.subscribeLesson();
    const subscription2 = SubmittedQuizzes.subscribeSubmittedQuiz();
    const subscription3 = UserProfiles.subscribe();
    const subscription4 = AdminProfiles.subscribe();
    const rdy = subscription1.ready() && subscription2.ready() && subscription3.ready() && subscription4.ready();
    const lssn = Lessons.findOne({ _id: _id }, {});
    const quizExist = SubmittedQuizzes.findOne({ owner: usrname, lessonID: _id }, {});

    let usr = UserProfiles.findOne({ email: usrname }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ email: usrname }, {});
    return {
      username: usrname,
      lesson: lssn,
      quizExists: quizExist !== undefined,
      user: usr,
      ready: rdy,
    };
  }, [_id]);

  const setAnswer = (index, option) => {
    answers[index].option = option;
  };

  const submit = () => {
    const answersFormatted = [];
    let errr = false;
    answers.every((answer, i) => {
      if (answer.option === undefined) {
        errr = true;
        return false;
      }
      const answerItem = { question: answer.question, selected: answer.option, correct: false };
      if (lesson.quiz[i].correct === answer.option) {
        answerItem.correct = true;
      }
      answersFormatted.push(answerItem);
      return true;
    });
    if (errr) {
      swal('Quiz Incomplete', 'Please select an option for all questions', 'error');
      return;
    }
    const numCorrect = _.where(answersFormatted, { correct: true }).length;
    const collectionName = SubmittedQuizzes.getCollectionName();
    const definitionData = { owner: username, lessonID: lesson._id, numCorrect: numCorrect, answers: answersFormatted, firstAttempt: !quizExists };

    if (!quizExists) {
      let userCollectionName = UserProfiles.getCollectionName();
      if (Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN])) {
        userCollectionName = AdminProfiles.getCollectionName();
      }
      const updateData = { id: user._id, totalPoints: user.totalPoints + Math.floor((numCorrect / answers.length) * 100) };
      updateMethod.callPromise({ collectionName: userCollectionName, updateData });
    }

    defineMethod.callPromise({ collectionName, definitionData })
      .catch(err => {
        swal('Error', err.message, 'error');
        throw err;
      })
      .then((response) => {
        swal('Success', 'Quiz submitted!', 'success');
        setRedirect(response);
      });
  };

  if (redirect !== '') {
    return <Navigate to={`/quiz-results/${redirect}`} />;
  }

  // Populate answers array
  if (ready) {
    lesson.quiz.forEach(quizItem => {
      const answerItem = { question: quizItem.question, option: undefined };
      answers.push(answerItem);
    });
  }

  return ready ? (
    <Container id={PAGE_IDS.QUIZ_PAGE} className="py-3 mb-5">
      <h1>Quiz</h1>
      <h4>{lesson.title}</h4>
      <hr />
      {lesson.quiz.map((item, index) => (
        <QuizQuestion key={index} quizItem={item} index={index} setAnswer={setAnswer} />
      ))}
      <Button variant="primary" type="button" onClick={submit}>Submit Quiz</Button>
    </Container>
  ) : '';
};

export default Quiz;
