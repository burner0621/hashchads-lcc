import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";

import Search from '../../Components/Search'

const Overview = () => {
  document.title ="Overview";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
              <Search />
              </div>
            </Col>

          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Overview;
