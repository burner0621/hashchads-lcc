import React from "react";
import { Col, Card, CardBody, CardHeader, Row, Button } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";

const ApplicationsStatistic = () => {
  const series = [
    {
      name: "New Application",
      data: [89, 56, 74, 98, 72, 38, 64, 46, 84, 58, 46, 49],
    },
    {
      name: "Interview",
      data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
    },
    {
      name: " Hired",
      data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35],
    },
  ];
  const options = {
    chart: {
      height: 345,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#45cb85d9", "#4b38b3", "#007bff"],

    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [3, 4, 3],
      curve: "straight",
      dashArray: [0, 8, 5],
    },
    series: [
      {
        name: "New Application",
        data: [89, 56, 74, 98, 72, 38, 64, 46, 84, 58, 46, 49],
      },
      {
        name: "Interview",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
      },
      {
        name: " Hired",
        data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35],
      },
    ],
    markers: {
      size: 0,

      hover: {
        sizeOffset: 6,
      },
    },
    xaxis: {
      categories: [
        "01 Jan",
        "02 Jan",
        "03 Jan",
        "04 Jan",
        "05 Jan",
        "06 Jan",
        "07 Jan",
        "08 Jan",
        "09 Jan",
        "10 Jan",
        "11 Jan",
        "12 Jan",
      ],
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  return (
    <React.Fragment>
      <Col xxl={8}>
        <Card className="card-height-100">
          <CardHeader className="border-0 align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">
              Applications Statistic
            </h4>
            <div>
              <Button type="button" className="btn btn-soft-secondary btn-sm">
                ALL
              </Button>
              <Button type="button" className="btn btn-soft-secondary btn-sm">
                1M
              </Button>
              <Button type="button" className="btn btn-soft-secondary btn-sm">
                6M
              </Button>
              <Button type="button" className="btn btn-soft-primary btn-sm">
                1Y
              </Button>
            </div>
          </CardHeader>

          <CardHeader className="p-0 border-0 bg-soft-light">
            <Row className="g-0 text-center">
              <Col xs={6} sm={3}>
                <div className="p-3 border border-dashed border-start-0">
                  <h5 className="mb-1">
                    <span className="counter-value" data-target="3364">
                      <CountUp start={0} end={3364} duration={4} />
                    </span>
                  </h5>
                  <p className="text-muted mb-0">New Applications</p>
                </div>
              </Col>
              <Col xs={6} sm={3}>
                <div className="p-3 border border-dashed border-start-0">
                  <h5 className="mb-1">
                    <span className="counter-value" data-target="2804">
                      <CountUp start={0} end={2804} duration={4} />
                    </span>
                  </h5>
                  <p className="text-muted mb-0">Interview</p>
                </div>
              </Col>
              <Col xs={6} sm={3}>
                <div className="p-3 border border-dashed border-start-0">
                  <h5 className="mb-1">
                    <span className="counter-value" data-target="2402">
                      <CountUp start={0} end={2402} duration={4} />
                    </span>
                  </h5>
                  <p className="text-muted mb-0">Hired</p>
                </div>
              </Col>
              <Col xs={6} sm={3}>
                <div className="p-3 border border-dashed border-start-0 border-end-0">
                  <h5 className="mb-1 text-success">
                    <span className="counter-value" data-target="8">
                      <CountUp start={0} end={8} duration={4} />
                    </span>
                    K
                  </h5>
                  <p className="text-muted mb-0">Total Applications</p>
                </div>
              </Col>
            </Row>
          </CardHeader>

          <CardBody className="p-0 pb-2">
            <div className="w-100">
              <ReactApexChart
                dir="ltr"
                options={options}
                series={series}
                type="line"
                height="345"
                className="apex-charts"
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default ApplicationsStatistic;
