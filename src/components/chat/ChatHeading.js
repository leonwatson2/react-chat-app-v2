import React, { Component } from 'react';
import { FaVideo, FaUserPlus, FaEllipsisH } from 'react-icons/fa'


export default class ChatHeading extends Component {
	render() {
		const { name, online, numberOfUsers } = this.props
		const onlineText = online ? 'online' : 'offline'
		return (
			<div className="chat-header">
				<div className="user-info">
					<div className="user-name">{name}</div>
					<div className="status">
						<div className={`indicator ${onlineText}`}></div>
						<span>{numberOfUsers ? numberOfUsers : null} online</span>
					</div>
				</div>
				<div className="options">
					<FaVideo />
					<FaUserPlus />
					<FaEllipsisH />
				</div>
			</div>
		);
	}
}