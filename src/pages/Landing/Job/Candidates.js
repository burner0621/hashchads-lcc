import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar10 from "../../../assets/images/users/avatar-10.jpg";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/css";
import { Link } from "react-router-dom";

const Candidates = () => {
  return (
    <React.Fragment>
      <section className="section bg-light" id="candidates">
        <div className="bg-overlay bg-overlay-pattern"></div>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center mb-5">
                <h1 className="mb-3 fw-semibold text-capitalize lh-base">
                  Hire Experts <span className="text-primary">Team</span>
                </h1>
                <p className="text-muted mb-4">
                  Hiring experts costs more per hour than hiring entry- or
                  mid-level freelancers, but they can usually get the work done
                  faster—and better.
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Swiper
                slidesPerView={4}
                spaceBetween={20}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="swiper candidate-swiper"
              >
                <div className="swiper-wrapper">
                  <SwiperSlide className="swiper-slide">
                    <Card className="text-center">
                      <CardBody className="p-4">
                        <img
                          src={avatar2}
                          alt=""
                          className="rounded-circle avatar-md mx-auto d-block"
                        />
                        <h5 className="fs-17 mt-3 mb-2">Nancy Martino</h5>
                        <p className="text-muted fs-13 mb-3">
                          Creative Designer
                        </p>

                        <p className="text-muted mb-4 fs-14">
                          <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                          Escondido, California
                        </p>

                        <Link to="#!" className="btn btn-primary w-100">
                          View Profile
                        </Link>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <Card className="text-center">
                      <CardBody className="p-4">
                        <img
                          src={avatar3}
                          alt=""
                          className="rounded-circle avatar-md mx-auto d-block"
                        />
                        <h5 className="fs-17 mt-3 mb-2">Glen Matney</h5>
                        <p className="text-muted fs-13 mb-3">
                          Marketing Director
                        </p>

                        <p className="text-muted mb-4 fs-14">
                          <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                          Escondido, California
                        </p>

                        <Link to="#!" className="btn btn-primary w-100">
                          View Profile
                        </Link>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <Card className="text-center">
                      <CardBody className="p-4">
                        <img
                          src={avatar10}
                          alt=""
                          className="rounded-circle avatar-md mx-auto d-block"
                        />
                        <h5 className="fs-17 mt-3 mb-2">Alexis Clarke</h5>
                        <p className="text-muted fs-13 mb-3">Product Manager</p>

                        <p className="text-muted mb-4 fs-14">
                          <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                          Escondido, California
                        </p>

                        <Link to="#!" className="btn btn-primary w-100">
                          View Profile
                        </Link>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <Card className="text-center">
                      <CardBody className="p-4">
                        <img
                          src={avatar8}
                          alt=""
                          className="rounded-circle avatar-md mx-auto d-block"
                        />
                        <h5 className="fs-17 mt-3 mb-2">James Price</h5>
                        <p className="text-muted fs-13 mb-3">
                          Product Designer
                        </p>

                        <p className="text-muted mb-4 fs-14">
                          <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                          Escondido, California
                        </p>

                        <Link to="#!" className="btn btn-primary w-100">
                          View Profile
                        </Link>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <Card className="text-center">
                      <CardBody className="p-4">
                        <img
                          src={avatar5}
                          alt=""
                          className="rounded-circle avatar-md mx-auto d-block"
                        />
                        <h5 className="fs-17 mt-3 mb-2">Michael Morris</h5>
                        <p className="text-muted fs-13 mb-3">
                          Full Stack Developer
                        </p>

                        <p className="text-muted mb-4 fs-14">
                          <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                          Escondido, California
                        </p>

                        <Link to="#!" className="btn btn-primary w-100">
                          View Profile
                        </Link>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                </div>
              </Swiper>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Candidates;
