import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { jobCategories } from "../../../common/data/appsJobs";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const JobCategories = () => {
  document.title = "Job Categories | Velzon -  Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Job Categories" pageTitle="Jobs" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="justify-content-between gy-3">
                    <Col lg={3}>
                      <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for job categories..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto">
                      <div className="d-md-flex text-nowrap gap-2">
                        <Button
                          color="info"
                          className="btn add-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#showModal"
                        >
                          <i className="ri-add-fill me-1 align-bottom"></i> Add
                          Categories
                        </Button>
                        <Button color="danger" className="btn">
                          <i className="ri-filter-2-line me-1 align-bottom"></i>{" "}
                          Filters
                        </Button>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            type="button"
                            role="button"
                            tag="button"
                            id="dropdownMenuLink1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            className="btn btn-soft-info"
                          >
                            <i className="ri-more-2-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu aria-labelledby="dropdownMenuLink1">
                            <li>
                              <DropdownItem href="#">All</DropdownItem>
                            </li>
                            <li>
                              <DropdownItem href="#">Last Week</DropdownItem>
                            </li>
                            <li>
                              <DropdownItem href="#">Last Month</DropdownItem>
                            </li>
                            <li>
                              <DropdownItem href="#">Last Year</DropdownItem>
                            </li>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          <Row className="row-cols-xxl-5 row-cols-lg-3 row-cols-md-2 row-cols-1">
            {jobCategories.map((item, key) => (
              <Col key={key}>
                <Card>
                  <CardBody className="text-center py-4">
                    <lord-icon
                      src={item.icon}
                      trigger="hover"
                      colors="primary:#405189"
                      target="div"
                      style={{ width: "50px", height: "50px" }}
                    ></lord-icon>
                    <Link to="#!" className="stretched-link">
                      <h5 className="mt-4">{item.lable}</h5>
                    </Link>
                    <p className="text-muted mb-0">{item.position}</p>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          <Row>
            <Col lg={12}>
              <div className="text-center mb-3">
                <Button
                  className="btn btn-link text-success mt-2"
                  id="loadmore"
                >
                  <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>{" "}
                  Load More{" "}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default JobCategories;
