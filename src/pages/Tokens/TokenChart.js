import React from 'react';
import { Card, Col } from 'reactstrap';
import Chart from '../../Components/tradingview/index';

const TokenChart = ({ dataColors, tokenId }) => {

    return (
        <React.Fragment>
            <Col xxl={9}>
                <Card className="card-height-100">
                    <Chart symbol={"AAPL"} stock={"Stock"} interval="5" width="100%" tokenId={tokenId} height="100%"/>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default TokenChart;