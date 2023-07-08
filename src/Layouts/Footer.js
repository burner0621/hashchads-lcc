import React from 'react';
import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer new-bg">
                <Container fluid>
                    <Row>
                        <Col xs={6} sm={6}>
                            {new Date().getFullYear()} © Hashchads.
                        </Col>
                        <Col xs={6} sm={6}>
                            <div className="text-end">
                                Design & Develop by Themesbrand
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;