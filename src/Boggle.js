import React, { Component } from 'react';
import { Row, Col } from 'antd';
import 'antd/dist/antd.css';

export default class Boggle extends Component {
	render() {
		return (
			<Row gutter={[16, 16]}>
				<Col span={4}></Col>
				<Col span={16}></Col>
				<Col span={4}></Col>
			</Row>
		);
	}
}
