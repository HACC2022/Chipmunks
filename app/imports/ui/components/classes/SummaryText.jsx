import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const SummaryText = ({ eventKey, summary, textLen }) => {
  const readMore = () => {
    const dots = document.getElementById(`dots-${eventKey}`);
    const moreText = document.getElementById(`more-${eventKey}`);
    const moreButton = document.getElementById(`read-more-${eventKey}`);

    if (moreText.style.display === 'none') {
      moreText.style.display = 'inline';
      moreButton.innerHTML = 'Read Less...';
      dots.style.display = 'none';
    } else {
      moreText.style.display = 'none';
      moreButton.innerHTML = 'Read More...';
      dots.style.display = 'inline';
    }
  };

  if (summary.length > textLen) {
    return (
      <>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {summary.substring(0, textLen)}
          <span id={`dots-${eventKey}`}>...</span>
          <span id={`more-${eventKey}`} style={{ display: 'none' }}>{summary.substring(textLen)}</span>
        </p>
        <Button id={`read-more-${eventKey}`} variant="outline-secondary" type="button" onClick={readMore} size="sm">Read More...</Button>
      </>
    );
  }
  return (
    <p>{summary}</p>
  );
};

SummaryText.propTypes = {
  eventKey: PropTypes.number.isRequired,
  summary: PropTypes.string.isRequired,
  textLen: PropTypes.number.isRequired,
};

export default SummaryText;
