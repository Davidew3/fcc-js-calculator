import React from 'react'
import logo from '../logo.svg'
import Freecclogo from '../freecc-logo.svg'

const Header = () => {
	return (
		<header className='App-Header'>
			<img src={logo} className='App-logo' alt='logo' />
			<h2>React 17 & Bootstrap: JS-Calculator</h2>
			<img src={Freecclogo} className='App-fcc-logo' alt='fcc-logo' />
		</header>
	)
}

export default Header
