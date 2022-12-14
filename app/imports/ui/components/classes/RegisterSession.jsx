import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Button, Modal } from 'react-bootstrap';
import { UserLessons } from '../../../api/user/UserLessonCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';

const RegisterSession = ({ sessionID, type, modal }) => {
  const username = Meteor.user() ? Meteor.user().username : '';

  if (username === '') {
    return (
      <Modal
        show={modal.show}
        onHide={() => {
          modal.setShow(false);
        }}
        centered
      >
        <Modal.Body className="text-center p-5">
          <h2>{`Please log in to register for this ${type.toLowerCase()}, track your progress, and take quizzes`}</h2>
          <Button variant="primary" button="button" href="/sign-in-up">Log in</Button>
        </Modal.Body>
      </Modal>
    );
  }

  const submit = () => {
    const collectionName = UserLessons.getCollectionName();
    let definitionData;
    if (type === 'Event') {
      definitionData = { registeredUser: username, sessionID: sessionID, joined: new Date() };
    } else {
      definitionData = { registeredUser: username, lessonID: sessionID, joined: new Date() };
    }
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => {
        swal('Error', error.message, 'error');
        throw error;
      })
      .then(() => {
        swal('Success', `${type} Registered!`, 'success');
        modal.setShow(false);
      });
  };

  return (
    <Modal
      show={modal.show}
      onHide={() => {
        modal.setShow(false);
      }}
      centered
    >
      <Modal.Body className="text-center p-5">
        <h2>{`Are you sure you want to register for this ${type}?`}</h2>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={() => modal.setShow(false)}>Cancel</Button>
        <Button variant="success" type="button" onClick={submit}>Register</Button>
      </Modal.Footer>
    </Modal>
  );
};

RegisterSession.propTypes = {
  sessionID: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  modal: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired,
  }).isRequired,
};

export default RegisterSession;
