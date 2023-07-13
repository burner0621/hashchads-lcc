import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import HashFrens_png from '../assets/images/hashfrens.png'

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer new-bg" style={{ right:0, position:"fixed", bottom:0}}>
                <Container fluid>
                    <Row>
                        <Col xs={6} sm={6}>
                            {new Date().getFullYear()} © Hashchads.
                        </Col>
                        <Col xs={6} sm={6}>
                            <div className="text-end">
                                Brought to you by 
                                <a href="https://hashchads.app/tokens/0.0.2126066"> Hashfrens
                                <img src={HashFrens_png} height="20" style={{marginLeft: 5}}/>
                                </a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;