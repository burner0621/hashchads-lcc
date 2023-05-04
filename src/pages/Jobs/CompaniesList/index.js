import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Row,
  Table,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import img6 from "../../../assets/images/companies/img-6.png";
import { jobCompanies } from "../../../common/data/appsJobs";
const CompaniesList = () => {
  const option = [
    {
      options: [
        { label: "All", value: "All" },
        { label: "Full Time", value: "Full Time" },
        { label: "Part Time", value: "Part Time" },
        { label: "Intership", value: "Intership" },
        { label: "Freelance", value: "Freelance" },
      ],
    },
  ];
  document.title = "Companies | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Companies List" pageTitle="Companies" />
          <Row>
            <Col xxl={9}>
              <Card>
                <CardBody>
                  <Form>
                    <Row className="g-3">
                      <Col xxl={5} sm={6}>
                        <div className="search-box">
                          <Input
                            type="text"
                            className="form-control search bg-light border-light"
                            id="searchCompany"
                            placeholder="Search for company, industry type..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </Col>

                      <Col xxl={3} sm={6}>
                        <Flatpickr
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder="Select a date"
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            mode: "multiple",
                            dateFormat: "d.m.y",
                          }}
                        />
                      </Col>

                      <Col xxl={2} sm={4}>
                        <div className="input-light">
                          <Select
                            options={option}
                            name="choices-single-default"
                            id="idType"
                          ></Select>
                        </div>
                      </Col>

                      <Col xxl={2} sm={4}>
                        <Button
                          type="button"
                          color="danger"
                          className="btn w-100"
                          //   onclick="filterData();"
                        >
                          <i className="ri-equalizer-fill me-1 align-bottom"></i>{" "}
                          Filters
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>

              <Row className="job-list-row" id="companies-list">
                {jobCompanies.map((item, key) => (
                  <Col xxl={3} md={6} key={key}>
                    <Card className="companiesList-card">
                      <CardBody>
                        <div className="avatar-sm mx-auto">
                          <div className="avatar-title bg-light rounded">
                            <img
                              src={item.image_src}
                              alt=""
                              className="avatar-xxs companyLogo-img"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <a href="#!">
                            <h5 className="mt-3 company-name">{item.lable}</h5>
                          </a>
                          <div className="d-none company-desc">
                            {item.company_info}
                          </div>
                          <p className="text-muted industry-type">
                            {item.industry_type}
                          </p>
                          <div className="d-none">
                            <span className="employee">{item.employee}</span>
                            <span className="location">{item.location}</span>
                            <span className="rating">{item.rating}</span>
                            <span className="website">{item.website}</span>
                            <span className="email">{item.email}</span>
                            <span className="since">{item.since}</span>
                          </div>
                        </div>
                        <div>
                          <Button
                            type="button"
                            className="btn btn-soft-primary border-0 w-100 viewcompany-list"
                          >
                            <span className="vacancy">{item.vacancy}</span> Jobs
                            Available
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row
                className="g-0 justify-content-end mb-4"
                id="pagination-element"
              >
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
            </Col>
            <Col xxl={3}>
              <Card id="company-overview">
                <CardBody>
                  <div className="avatar-lg mx-auto mb-3">
                    <div className="avatar-title bg-light rounded">
                      <img
                        src={img6}
                        alt=""
                        className="avatar-sm company-logo"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <Link to="#!">
                      <h5 className="overview-companyname fw-semibold fs-17">
                        Syntyce Solutions
                      </h5>
                    </Link>
                    <p className="text-muted overview-industryType">
                      IT Department
                    </p>

                    <ul className="list-inline mb-0">
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to=""
                          className="avatar-title bg-soft-success text-success fs-15 rounded"
                        >
                          <i className="ri-global-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to=""
                          className="avatar-title bg-soft-danger text-danger fs-15 rounded"
                        >
                          <i className="ri-mail-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to=""
                          className="avatar-title bg-soft-warning text-warning fs-15 rounded"
                        >
                          <i className="ri-question-answer-line"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </CardBody>

                <CardBody>
                  <h6 className="text-muted text-uppercase fw-medium mb-3">
                    Information
                  </h6>
                  <p className="text-muted mb-4 overview-companydesc">
                    The IT department of NavLink company ensures that the
                    network of computers within the organisation are
                    well-connected and functioning properly. All the other
                    departments within the company rely on them to ensure that
                    their respective functions can go on seamlessly.
                  </p>

                  <div className="table-responsive table-card">
                    <Table className="table table-borderless mb-4">
                      <tbody>
                        <tr>
                          <td className="fw-medium">Industry Type</td>
                          <td className="overview-industryType">
                            Chemical Industries
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Location</td>
                          <td className="overview-company_location">
                            Damascus, Syria
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Employee</td>
                          <td className="overview-employee">10-50</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Vacancy</td>
                          <td className="overview-vacancy">23</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Rating</td>
                          <td>
                            <span className="overview-rating">4.8</span>{" "}
                            <i className="ri-star-fill text-warning align-bottom"></i>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Website</td>
                          <td>
                            <Link
                              to=""
                              className="link-primary text-decoration-underline overview-website"
                            >
                              www.syntycesolution.com
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Contact Email</td>
                          <td className="overview-email">
                            info@syntycesolution.com
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Since</td>
                          <td className="overview-since">1995</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <div className="hstack gap-3">
                    <Button
                      type="button"
                      color="success"
                      className="btn btn-soft-success custom-toggle w-100"
                      data-bs-toggle="button"
                    >
                      <span className="icon-on">
                        <i className="ri-add-line align-bottom me-1"></i> Follow
                      </span>
                      <span className="icon-off">
                        <i className="ri-user-unfollow-line align-bottom me-1"></i>{" "}
                        Unfollow
                      </span>
                    </Button>
                    <Button to="#!" color="info" className="btn w-100">
                      More View{" "}
                      <i className="ri-arrow-right-line align-bottom"></i>
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <Card className="overflow-hidden shadow-none">
                <CardBody className="bg-soft-danger">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="avatar-sm">
                        <div className="avatar-title bg-soft-danger text-danger rounded-circle fs-17">
                          <i className="ri-gift-line"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      <h6 className="fs-16 ">Free trial</h6>
                      <p className="text-muted mb-0">28 days left</p>
                    </div>
                    <div>
                      <NavLink to="/pages-pricing" className="btn btn-danger">
                        Upgrade
                      </NavLink>
                    </div>
                  </div>
                </CardBody>
                <CardBody className="bg-soft-danger border-top border-danger border-opacity-25 border-top-dashed">
                  <Link
                    to="#!"
                    className="d-flex justify-content-between align-items-center text-body"
                  >
                    <span>See benefits</span>
                    <i className="ri-arrow-right-s-line fs-18"></i>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CompaniesList;
