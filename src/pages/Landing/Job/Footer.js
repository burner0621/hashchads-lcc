import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import LogoLight from "../../../assets/images/logo-light.png";
const Footer = () => {
  return (
    <React.Fragment>
      <footer className="custom-footer bg-dark py-5 position-relative">
        <Container>
          <Row>
            <Col lg={4} className="mt-4">
              <div>
                <div>
                  <img src={LogoLight} alt="logo light" height="17" />
                </div>
                <div className="mt-4 fs-15">
                  <p>Premium Multipurpose Admin & Dashboard Template</p>
                  <p>
                    You can build any type of web application like eCommerce,
                    CRM, CMS, Project management apps, Admin Panels, etc using
                    Velzon.
                  </p>
                  <ul className="list-inline mb-0 footer-social-link">
                    <li className="list-inline-item">
                      <Link to="#!" className="avatar-xs d-block">
                        <div className="avatar-title rounded-circle">
                          <i className="ri-facebook-fill"></i>
                        </div>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link to="#!" className="avatar-xs d-block">
                        <div className="avatar-title rounded-circle">
                          <i className="ri-github-fill"></i>
                        </div>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link to="#!" className="avatar-xs d-block">
                        <div className="avatar-title rounded-circle">
                          <i className="ri-linkedin-fill"></i>
                        </div>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link to="#!" className="avatar-xs d-block">
                        <div className="avatar-title rounded-circle">
                          <i className="ri-google-fill"></i>
                        </div>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link to="#!" className="avatar-xs d-block">
                        <div className="avatar-title rounded-circle">
                          <i className="ri-dribbble-line"></i>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={7} className="ms-lg-auto">
              <Row>
                <Col sm={4} className="mt-4">
                  <h5 className="text-white mb-0">Company</h5>
                  <div className="text-muted mt-3">
                    <ul className="list-unstyled ff-secondary footer-list fs-15">
                      <li>
                        <NavLink to="/pages-profile">About Us</NavLink>
                      </li>
                      <li>
                        <NavLink to="/pages-gallery">Gallery</NavLink>
                      </li>
                      <li>
                        <NavLink to="/pages-team">Team</NavLink>
                      </li>
                      <li>
                        <NavLink to="/pages-pricing">Pricing</NavLink>
                      </li>
                      <li>
                        <NavLink to="/pages-timeline">Timeline</NavLink>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col sm={4} className="mt-4">
                  <h5 className="text-white mb-0">For Jobs</h5>
                  <div className="text-muted mt-3">
                    <ul className="list-unstyled ff-secondary footer-list fs-15">
                      <li>
                        <NavLink to="/apps-job-lists">Job List</NavLink>
                      </li>
                      <li>
                        <NavLink to="/apps-job-application">
                          application
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/apps-job-new">New Job</NavLink>
                      </li>
                      <li>
                        <NavLink to="/apps-job-companies-lists">
                          Company List
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col sm={4} className="mt-4">
                  <h5 className="text-white mb-0">Support</h5>
                  <div className="text-muted mt-3">
                    <ul className="list-unstyled ff-secondary footer-list fs-15">
                      <li>
                        <NavLink to="/pages-faqs">FAQ</NavLink>
                      </li>
                      <li>
                        <NavLink to="/pages-faqs">Contact</NavLink>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="text-center text-sm-start align-items-center mt-5">
            <Col sm={6}>
              <div>
                <p className="copy-rights mb-0">
                  <script> document.write(new Date().getFullYear()) </script>
                  2022 © Velzon - Themesbrand
                </p>
              </div>
            </Col>
            <Col sm={6}>
              <div className="text-sm-end mt-3 mt-sm-0">
                <ul className="list-inline mb-0 footer-list gap-4 fs-15">
                  <li className="list-inline-item">
                    <NavLink to="/pages-privacy-policy">Privacy Policy</NavLink>
                  </li>
                  <li className="list-inline-item">
                    <NavLink to="/pages-term-conditions">
                      Terms & Conditions
                    </NavLink>
                  </li>
                  <li className="list-inline-item">
                    <NavLink to="/pages-privacy-policy">Security</NavLink>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
