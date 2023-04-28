// Accordion bookings on user profile

import React from 'react';
import { Accordion, Card, ListGroup } from 'react-bootstrap';

const AccordionBooking = (props) => {
  const { data, index } = props;

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
        Booking at {data.name}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={`${index}`}>
        <Card.Body>
          <ListGroup>
            <ListGroup.Item><strong>Type</strong>: {data.type}</ListGroup.Item>
            <ListGroup.Item><strong>Location</strong>: {data.location}</ListGroup.Item>
            <ListGroup.Item><strong>Date</strong>: {data.date}</ListGroup.Item>
            <ListGroup.Item><strong>Price</strong>: {data.price}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default AccordionBooking;
