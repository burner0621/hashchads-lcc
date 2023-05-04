import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";

const JobSummary = ({ dataColors }) => {
  var revenueExpensesChartsColors = getChartColorsArray(dataColors);
  var series = [
    {
      name: "Application Sent",
      data: [33, 28, 30, 35, 40, 55, 70, 110, 150, 180, 210, 250],
    },
    {
      name: " Interviews",
      data: [20, 26, 45, 32, 42, 53, 59, 70, 78, 97, 110, 125],
    },
    {
      name: " Hired",
      data: [12, 17, 45, 42, 24, 35, 42, 75, 102, 108, 156, 199],
    },
    {
      name: " Rejected",
      data: [8, 13, 22, 27, 32, 34, 46, 59, 65, 97, 100, 110],
    },
  ];
  var options = {
    chart: {
      height: 320,
      type: "area",
      toolbar: "false",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    colors: revenueExpensesChartsColors,
    fill: {
      opacity: 0.06,
      colors: revenueExpensesChartsColors,
      type: "solid",
    },
  };
  return (
    <React.Fragment>
      <Col xxl={8} md={6}>
        <Card className="card-height-100">
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Jobs Summary</h4>
            <div className="flex-shrink-0">
              <UncontrolledDropdown className="card-header-dropdown">
                <DropdownToggle
                    className="text-reset dropdown-btn"
                    tag="a"
                    type="a"
                    to="#"
                  >
                  <span className="fw-semibold text-uppercase fs-12">
                    Sort by:{" "}
                  </span>
                  <span className="text-muted">
                    Current Year
                    <i className="mdi mdi-chevron-down ms-1"></i>
                  </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem href="#">Today</DropdownItem>
                  <DropdownItem href="#">Last Week</DropdownItem>
                  <DropdownItem href="#">Last Month</DropdownItem>
                  <DropdownItem href="#">Current Year</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </CardHeader>
          <CardBody className="px-0">
            <ReactApexChart
              dir="ltr"
              className="apex-charts"
              series={series}
              options={options}
              type="area"
              height={320}
            />
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default JobSummary;
