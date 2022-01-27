import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthPage, ChatPage } from './pages';

export const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<AuthPage />} />
				<Route path='/chat/:name' element={<ChatPage />} />
			</Routes>
		</BrowserRouter>
	);
};
