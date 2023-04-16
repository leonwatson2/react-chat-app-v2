import React, { useEffect, useRef } from 'react';

const Messages = ({ messages, user, typingUsers }) => {
	const containerRef = useRef();
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
		}
	}, [containerRef])
	return (
		<div ref={containerRef}
			className="thread-container">
			<div className="thread">
				{
					messages && messages.map((mes, i) => {

						return (
							<div key={mes.id} className={`message-container ${mes.sender === user.name && 'right'}`}>
								<div className="time">{mes.time}</div>
								<div className="data">
									<div className="message">{mes.message}</div>
									<div className="name">{mes.sender}</div>
								</div>
							</div>)
					})

				}
				{
					typingUsers && typingUsers.map((name) => {
						return (
							<div key={name} className="typing-user">
								{`${name} is typing . . .`}
							</div>
						)
					})
				}

			</div>
		</div>
	);

}
export default Messages

