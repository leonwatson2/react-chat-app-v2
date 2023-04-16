import React, { useState, useRef, useEffect, useCallback } from 'react';

function MessageInput({ sendMessage, sendTyping }) {
	const [message, setMessage] = useState('');
	// const [, setIsTyping] = useState(false);
	const typingIntervalRef = useRef(null);
	const messageInputRef = useRef(null);
	const lastUpdateTimeRef = useRef(Date.now());

	const stopCheckingTyping = useCallback(() => {
		if (typingIntervalRef.current) {
			clearInterval(typingIntervalRef.current);
			sendTyping(false);
		}
	}, [sendTyping])

	const handleSubmit = (e) => {
		e.preventDefault();
		sendMessage(message);

		setMessage('');
	}

	useEffect(() => {
		return () => {
			stopCheckingTyping();
		}
	}, [stopCheckingTyping])

	const onTyping = () => {
		lastUpdateTimeRef.current = Date.now();

		// if (!isTyping) {
		// 	setIsTyping(true);
		// 	sendTyping(true);
		// 	startCheckingTyping();
		// }
	}

	// const startCheckingTyping = () => {
	// 	typingIntervalRef.current = setInterval(() => {
	// 		if (Date.now() - lastUpdateTimeRef.current > 300) {
	// 			setIsTyping(false);
	// 			stopCheckingTyping();
	// 		}
	// 	}, 300);
	// }



	// const blur = () => {
	// 	messageInputRef.current.blur();
	// }

	return (
		<div className="message-input">
			<form onSubmit={handleSubmit} className="message-form">
				<input
					id="message"
					ref={messageInputRef}
					type="text"
					className="form-control"
					value={message}
					autoComplete="off"
					placeholder="Type something to send"
					onKeyUp={(e) => {
						e.keyCode !== 13 && onTyping();
					}}
					onChange={({ target: { value: v } }) => {
						setMessage(v);
					}}
				/>
				<button disabled={message.length < 1} type="submit" className="send">
					Send
				</button>
			</form>
		</div>
	);
}
export default MessageInput;