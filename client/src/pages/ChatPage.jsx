import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export const ChatPage = () => {
	const { name } = useParams();
	const [messages, setMessages] = useState([]);
	const [messageBody, setMessageBody] = useState('');
	const [isConnectionOpen, setConnectionOpen] = useState(false);


	const ws = useRef();
	const scrollTarget = useRef(null);
	useEffect(() => {
		// scrolls down automatically when new message is received
		if (scrollTarget.current) {
			scrollTarget.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages.length]);

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:8081');

		ws.current.onopen = () => {
			setConnectionOpen(true);
		};
	
		ws.current.onmessage = (ev) => {
			const message = JSON.parse(ev.data);
			setMessages((_messages) => [..._messages, message]);
		};
	
		return () => {
			// clean up function
			ws.current.close();
		};
	}, []);

	const send = () => {
		if (messageBody === '') return;
		ws.current.send(JSON.stringify({ sender: name, body: messageBody }));
		setMessageBody('');
	};

	return (
		<main>
			<header>
				<h1>chatt</h1>
			</header>

			<div>
				{messages.map((message) => (
					<div className='message-container'>
						<article
							key={message.sentAt}>
						<header>
							<h4 >{message.sender === name ? 'Du' : message.sender} {new Date(message.sentAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}</h4>
						</header>
						<p>{message.body}</p>
						</article>
					</div>
				))}
				<div ref={scrollTarget} />
			</div>

			<footer>
				<p>du chattar som “{name}”</p>

				<div>
				<input
					autoFocus
					aria-label='Type a message'
					placeholder='skriv ditt meddelande'
					type='text'
					autoComplete='off'

					value={messageBody}
					onChange={(e) => setMessageBody(e.target.value)}

					onKeyPress={(e) => {
						if (e.key === 'Enter') send();
					}}
				/>

				<button
					aria-label='Send'
					className='icon-button'
					onClick={send}
					disabled={!isConnectionOpen}
					>
					skicka
				</button>
				</div>
			</footer>
		</main>
	);
};
