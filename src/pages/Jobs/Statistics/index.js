import React from "react";
import { Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import JobSummary from "./JobSummary";
import NatworkSummary from "./NatworkSummary";
import UsersByDevice from "./UserDeviceChart";
import VisitorGraph from "./VisitorGraph";
import Widgets from "./Widgets";

const Statistics = () => {
  document.title = "Statistics | Velzon -  Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="STATISTICS" pageTitle="Jobs" />

          <Row>
            <Widgets dataColors='["--vz-success", "--vz-danger"]' />
          </Row>

          <Row>
            <VisitorGraph dataColors='["--vz-primary", "--vz-secondary", "--vz-success", "--vz-info","--vz-warning", "--vz-danger"]' />
            <UsersByDevice />
          </Row>

          <Row>
            <NatworkSummary dataColors='["--vz-danger", "--vz-warning"]' />
            <JobSummary dataColors='["--vz-success", "--vz-primary", "--vz-info", "--vz-danger"]' />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Statistics;
