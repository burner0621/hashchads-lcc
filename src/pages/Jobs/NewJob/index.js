import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import Select from "react-select";

const NewJobs = () => {
  document.title = "New Job | Velzon -  Admin & Dashboard Template";

  const SingleOptions = [
    {
      options: [
        { value: "Accounting & Finance", label: "Accounting & Finance" },
        { value: "Purchasing Manager", label: "Purchasing Manager" },
        { value: "Education & training", label: "Education & training" },
        { value: "Marketing & Advertising", label: "Marketing & Advertising" },
        { value: "It / Software Jobs", label: "It / Software Jobs" },
        { value: "Digital Marketing", label: "Digital Marketing" },
        { value: "Administrative Officer", label: "Administrative Officer" },
        { value: "Government Jobs", label: "Government Jobs" },
      ],
    },
  ];
  const JobType = [
    {
      options: [
        { value: "Full Time", label: "Full Time" },
        { value: "Part Time", label: "Part Time" },
        { value: "Freelancer", label: "Education & training" },
        { value: "Internship", label: "Internship" },
      ],
    },
  ];
  const Experience = [
    {
      options: [
        { value: "0 Years", label: "0 Years" },
        { value: "1 Years", label: "1 Years" },
        { value: "2 Years", label: "2 Years" },
        { value: "3 Years", label: "3 Years" },
        { value: "4 Years", label: "4 Years" },
      ],
    },
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="New Job" pageTitle="Jobs" />

          <Row>
            <Col lg={12}>
              <Card>
                <Form action="#">
                  <CardHeader>
                    <h5 className="card-title mb-0">Create Job</h5>
                  </CardHeader>
                  <CardBody>
                    <Row className="g-4">
                      <Col lg={6}>
                        <div>
                          <Label
                            htmlFor="job-title-Input"
                            className="form-label"
                          >
                            Job Title <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="job-title-Input"
                            placeholder="Enter job title"
                            required
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div>
                          <Label
                            htmlFor="job-position-Input"
                            className="form-label"
                          >
                            Job Position <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="job-position-Input"
                            placeholder="Enter job position"
                            required
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div>
                          <Label
                            htmlFor="job-category-Input"
                            className="form-label"
                          >
                            Job Category <span className="text-danger">*</span>
                          </Label>
                          <Select
                            className="js-example-basic-single mb-0"
                            name="state"
                            options={SingleOptions}
                            required
                          ></Select>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div>
                          <Label
                            htmlFor="job-type-Input"
                            className="form-label"
                          >
                            Job Type <span className="text-danger">*</span>
                          </Label>
                          <Select
                            className="js-example-basic-single mb-0"
                            data-choices
                            name="job-type-Input"
                            options={JobType}
                            required
                          ></Select>
                        </div>
                      </Col>

                      <Col lg={12}>
                        <div>
                          <Label
                            htmlFor="description-field"
                            className="form-label"
                          >
                            Description <span className="text-danger">*</span>
                          </Label>
                          <textarea
                            className="form-control"
                            id="description-field"
                            rows="3"
                            placeholder="Enter description"
                            required
                          ></textarea>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div>
                          <Label
                            htmlFor="vancancy-Input"
                            className="form-label"
                          >
                            No. of Vancancy{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="vancancy-Input"
                            placeholder="No. of vancancy"
                            required
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div>
                          <Label
                            htmlFor="experience-Input"
                            className="form-label"
                          >
                            Experience <span className="text-danger">*</span>
                          </Label>
                          <Select
                            className="js-example-basic-single mb-0"
                            options={Experience}
                          ></Select>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div>
                          <Label
                            htmlFor="last-apply-date-Input"
                            className="form-label"
                          >
                            Last Date of Apply{" "}
                            <span className="text-danger">*</span>
                          </Label>
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
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div>
                          <Label
                            htmlFor="close-date-Input"
                            className="form-label"
                          >
                            Close Date <span className="text-danger">*</span>
                          </Label>
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
                        </div>
                      </Col>

                      <Col md={6}>
                        <div>
                          <Label
                            htmlFor="start-salary-Input"
                            className="form-label"
                          >
                            Start Salary
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="start-salary-Input"
                            placeholder="Enter start salary"
                            required
                          />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div>
                          <Label
                            htmlFor="last-salary-Input"
                            className="form-label"
                          >
                            Last Salary
                          </Label>
                          <Input
                            type="number"
                            className="form-control"
                            id="last-salary-Input"
                            placeholder="Enter end salary"
                            required
                          />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div>
                          <Label htmlFor="country-Input" className="form-label">
                            Country <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="country-Input"
                            placeholder="Enter country"
                            required
                          />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div>
                          <Label htmlFor="city-Input" className="form-label">
                            State <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            className="form-control"
                            id="city-Input"
                            placeholder="Enter city"
                            required
                          />
                        </div>
                      </Col>

                      <Col lg={12}>
                        <div>
                          <Label htmlFor="website-field" className="form-label">
                            Tags
                          </Label>
                          <Input
                            color="primary"
                            className="form-control primary"
                            id="choices-text-unique-values"
                            data-choices
                            data-choices-text-unique-true
                            type="text"
                            defaultValue="Design, Remote"
                            required
                          />
                        </div>
                      </Col>

                      <Col lg={12}>
                        <div className="hstack justify-content-end gap-2">
                          <Button
                            type="button"
                            className="btn"
                            color="ghost-danger"
                          >
                            <i className="ri-close-line align-bottom"></i>{" "}
                            Cancel
                          </Button>
                          <Button type="submit" color="secondary">
                            Add Job
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewJobs;
