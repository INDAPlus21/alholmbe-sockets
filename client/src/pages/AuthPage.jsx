import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
	const navigate = useNavigate();
	const [name, setName] = useState('');

	const navigateToChatPage = () => {
		if (name !== '') navigate(`/chat/${name}`);
	};


	return (
		<main>
			<p>yo</p>

			<p>
				välj ett användarnamn:
			</p>

			<div>
			<input
				aria-labelledby='name-label'
				type='text'
				autoComplete='name'
				placeholder='ditt användarnamn'

				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyPress={(e) => {
					if (e.key === 'Enter') navigateToChatPage();
				}}
			/>

			</div>

			<div >
				<button onClick={navigateToChatPage}>börja chatta</button>
			</div>
		</main>
	);
};
