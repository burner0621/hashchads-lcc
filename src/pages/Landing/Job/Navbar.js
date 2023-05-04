import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Scrollspy from "react-scrollspy";
import {
  Collapse,
  Container,
  NavbarToggler,
  NavLink as TabLink,
} from "reactstrap";
import LogoDark from "../../../assets/images/logo-dark.png";
import LogoLight from "../../../assets/images/logo-light.png";
const Navbar = () => {
  const [isOpenMenu, setisOpenMenu] = useState(false);
  const [navClass, setnavClass] = useState("");

  const toggle = () => setisOpenMenu(!isOpenMenu);

  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
  });

  const scrollNavigation = () => {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setnavClass(" is-sticky");
    } else {
      setnavClass("");
    }
  };
  return (
    <React.Fragment>
      <nav
        className={
          "navbar navbar-expand-lg navbar-landing fixed-top job-navbar" +
          navClass
        }
        id="navbar"
      >
        <Container fluid className="custom-container">
          <NavLink className="navbar-brand" to="/index">
            <img
              src={LogoDark}
              className="card-logo card-logo-dark"
              alt="logo dark"
              height="17"
            />
            <img
              src={LogoLight}
              className="card-logo card-logo-light"
              alt="logo light"
              height="17"
            />
          </NavLink>
          <NavbarToggler
            onClick={toggle}
            className="navbar-toggler py-0 fs-20 text-body"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="mdi mdi-menu"></i>
          </NavbarToggler>

          <Collapse className="navbar-collapse" id="navbarSupportedContent">
            <Scrollspy
              offset={-18}
              items={[
                "hero",
                "process",
                "categories",
                "findJob",
                "candidates",
                "blog",
              ]}
              currentClassName="active"
              className="navbar-nav mx-auto mt-2 mt-lg-0"
              id="navbar-example"
            >
              <li className="nav-item">
                <TabLink className="nav-link fs-14" href="#hero">
                  Home
                </TabLink>
              </li>
              <li className="nav-item">
                <TabLink className="nav-link fs-14" href="#process">
                  Process
                </TabLink>
              </li>
              <li className="nav-item">
                <TabLink className="nav-link fs-14" href="#categories">
                  Categories
                </TabLink>
              </li>
              <li className="nav-item">
                <TabLink className="nav-link fs-14" href="#findJob">
                  Find Jobs
                </TabLink>
              </li>
              <li className="nav-item">
                <TabLink className="nav-link fs-14" href="#candidates">
                  Candidates
                </TabLink>
              </li>
              <li className="nav-item">
                <TabLink className="nav-link fs-14" href="#blog">
                  Blog
                </TabLink>
              </li>
            </Scrollspy>

            <div>
              <NavLink to="/auth-signin-basic" className="btn btn-soft-primary">
                <i className="ri-user-3-line align-bottom me-1"></i> Login &
                Register
              </NavLink>
            </div>
          </Collapse>
        </Container>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
