import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import Select from "react-select";
import { jobCandidatesList } from "../../../../common/data/appsJobs";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const CandidateList = () => {
  const [isBookmarkClick, setIsBookmarkClick] = useState(false);

  const sortbyname = [
    {
      options: [
        { label: "All", value: "All" },
        { label: "Today", value: "Today" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last 7 Days", value: "Last 7 Days" },
        { label: "Last 30 Days", value: "Last 30 Days" },
        { label: "Thise Month", value: "Thise Month" },
        { label: "Last Year", value: "Last Year" },
      ],
    },
  ];
  document.title = "Candidate List View | Velzon -  Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="List View" pageTitle="Candidates Lists" />

          <Row className="g-4 mb-4">
            <Col sm="auto">
              <div>
                <Link to="#!" className="btn btn-primary">
                  <i className="ri-add-line align-bottom me-1"></i> Add
                  Candidate
                </Link>
              </div>
            </Col>
            <Col className="col-sm">
              <div className="d-md-flex justify-content-sm-end gap-2">
                <div className="search-box ms-md-2 flex-shrink-0 mb-3 mb-md-0">
                  <Input
                    type="text"
                    className="form-control"
                    id="searchJob"
                    autoComplete="off"
                    placeholder="Search for candidate name or designation..."
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>

                <Select
                  className="js-example-basic-single mb-0"
                  options={sortbyname}
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.15)",
                    borderRadius: "5px",
                  }}
                ></Select>
              </div>
            </Col>
          </Row>

          <Row className="gy-2 mb-2" id="candidate-list">
            {jobCandidatesList.map((item, key) => (
              <Col lg={12} key={key}>
                <Card className="mb-0">
                  <CardBody>
                    <div className="d-lg-flex align-items-center">
                      <div className="flex-shrink-0">
                        {item.nickname ? (
                          <div className="avatar-title rounded-circle bg-light border-dashed border text-primary fs-18 p-2">
                            {item.nickname}
                          </div>
                        ) : (
                          <div className="avatar-sm rounded">
                            <img
                              src={item.userImg}
                              alt=""
                              className="member-img img-fluid d-block rounded"
                            ></img>
                          </div>
                        )}
                      </div>
                      <div className="ms-3">
                        <NavLink dto="/pages-profile">
                          <h5 className="fs-16 mb-2">{item.candidateName}</h5>
                        </NavLink>
                        <p className="text-muted mb-0">{item.designation}</p>
                      </div>
                      <div className="d-flex gap-4 mt-0 text-muted mx-auto">
                        <div>
                          <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                          {item.location}
                        </div>
                        <div>
                          <i className="ri-time-line text-primary me-1 align-bottom"></i>{" "}
                          {item.type === "Part Time" ? (
                            <span className="badge badge-soft-danger">
                              {item.type}
                            </span>
                          ) : item.type === "Full Time" ? (
                            <span className="badge badge-soft-success">
                              {item.type}
                            </span>
                          ) : (
                            <span className="badge badge-soft-secondary">
                              {item.type}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-wrap gap-2 align-items-center mx-auto">
                        <div className="badge text-bg-success">
                          <i className="mdi mdi-star me-1"></i>
                          {item.rating[0]}
                        </div>
                        <div className="text-muted">{item.rating[1]}</div>
                      </div>
                      <div>
                        <Link to="#!" className="btn btn-soft-success me-1">
                          View Details
                        </Link>
                        <Link
                          to="#!"
                          onClick={(e) => {
                            e.preventDefault();

                            setIsBookmarkClick(!isBookmarkClick);
                          }}
                          className={
                            isBookmarkClick
                              ? "btn btn-ghost-danger btn-icon custom-toggle active"
                              : "btn btn-ghost-danger btn-icon custom-toggle"
                          }
                          data-bs-toggle="button"
                        >
                          {!isBookmarkClick ? (
                            <span className="icon-on">
                              <i className="ri-bookmark-line align-bottom"></i>
                            </span>
                          ) : (
                            <span className="icon-off">
                              <i className="ri-bookmark-3-fill align-bottom"></i>
                            </span>
                          )}
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="g-0 justify-content-end mb-4" id="pagination-element">
            <Col sm={6}>
              <div className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                <div className="page-item">
                  <Link to="" className="page-link" id="page-prev">
                    Previous
                  </Link>
                </div>
                <span id="page-num" className="pagination"></span>
                <div className="page-item">
                  <Link to="" className="page-link" id="page-next">
                    Next
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CandidateList;
