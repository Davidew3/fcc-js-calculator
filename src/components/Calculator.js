import React, { useState, useEffect, useCallback } from 'react'
import * as math from 'mathjs'
import '../styles.css'

const inputBtns = [
	{ id: 'one', value: '1', type: 'number', text: '1' },
	{ id: 'two', value: '2', type: 'number', text: '2' },
	{ id: 'three', value: '3', type: 'number', text: '3' },
	{ id: 'four', value: '4', type: 'number', text: '4' },
	{ id: 'five', value: '5', type: 'number', text: '5' },
	{ id: 'six', value: '6', type: 'number', text: '6' },
	{ id: 'seven', value: '7', type: 'number', text: '7' },
	{ id: 'eight', value: '8', type: 'number', text: '8' },
	{ id: 'nine', value: '9', type: 'number', text: '9' },
	{ id: 'zero', value: '0', type: 'number', text: '0' },
	{ id: 'decimal', value: '.', type: 'number', text: '.' },
	{ id: 'add', value: '+', type: 'operator', text: '+' },
	{ id: 'subtract', value: '-', type: 'operator', text: '-' },
	{ id: 'multiply', value: '*', type: 'operator', text: '*' },
	{ id: 'divide', value: '/', type: 'operator', text: '/' },
	{ id: 'equals', value: '=', type: 'operator', text: '=' },
	{ id: 'clear', value: 'Clear', type: 'reset', text: 'Clear' },
]

const Calculator = () => {
	const [currentInput, setCurrentInput] = useState('0')
	const [expression, setExpression] = useState('')
	const [resetDisplay, setResetDisplay] = useState(false)
	const [shouldShowResult, setShouldShowResult] = useState(false) // New state

	const handleInput = useCallback(
		(input) => {
			if (input === '=') {
				try {
					const result = math.evaluate(expression).toFixed(10)
					setCurrentInput(parseFloat(result).toString())
					setExpression(parseFloat(result).toString())
					setResetDisplay(true)
					setShouldShowResult(true) // Show result when equals is pressed
				} catch {
					setCurrentInput('Error')
					setExpression('')
					setResetDisplay(true)
					setShouldShowResult(true) // Show error in case of invalid expression
				}
			} else if (input === '.') {
				const currentValue = currentInput.split(/[+\-*/]/).pop()
				if (!currentValue.includes('.') && currentValue !== '') {
					setExpression(expression + input)
					setCurrentInput(currentInput === '0' ? '0.' : currentInput + input)
					setShouldShowResult(false) // Show expression when typing
				}
			} else if (/[+\-*/]/.test(input)) {
				if (resetDisplay) {
					setResetDisplay(false)
				}

				if (/[+\-*/]$/.test(expression)) {
					if (input === '-') {
						if (!/[+\-*/]-$/.test(expression)) {
							setExpression(expression + input)
							setCurrentInput(input)
						}
					} else {
						setExpression(expression.replace(/[+\-*/]+$/, '') + input)
						setCurrentInput(input)
					}
				} else {
					setExpression(expression + input)
					setCurrentInput(input)
				}

				setShouldShowResult(false) // Show expression when typing
			} else {
				// Check for multiple leading zeros and ensure only one zero before a decimal
				if (currentInput === '0' && input === '0') {
					return // Prevent adding more than one leading zero
				}

				if (currentInput === '0' && input !== '0' && input !== '.') {
					// Replace leading zero if another number (not a decimal) is typed
					setCurrentInput(input)
					setExpression(expression.slice(0, -1) + input) // Update the expression without the leading zero
				} else if (resetDisplay) {
					setCurrentInput(input)
					setExpression(input)
					setResetDisplay(false)
				} else {
					setCurrentInput(currentInput + input)
					setExpression(expression + input)
				}

				setShouldShowResult(false) // Show expression when typing
			}
		},
		[currentInput, expression, resetDisplay]
	)

	useEffect(() => {
		const handleKeyPress = (event) => {
			const key = event.key
			const button = inputBtns.find(
				(btn) => btn.text === key || btn.value === key
			)
			if (button) {
				handleInput(button.value)
			}
		}
		window.addEventListener('keydown', handleKeyPress)
		return () => {
			window.removeEventListener('keydown', handleKeyPress)
		}
	}, [handleInput])

	const handleReset = () => {
		setCurrentInput('0')
		setExpression('')
		setResetDisplay(false)
		setShouldShowResult(false) // Reset everything
	}

	return (
		<div className='container'>
			{/* Conditionally show the full expression or just the current input/result */}
			<input
				id='display'
				type='text'
				value={shouldShowResult ? currentInput : expression}
				placeholder='0'
			/>
			{inputBtns.map((btn) => (
				<button
					key={btn.id}
					id={btn.id}
					className={`btn ${btn.type}`}
					onClick={() =>
						btn.type === 'reset' ? handleReset() : handleInput(btn.value)
					}
					dangerouslySetInnerHTML={{ __html: btn.text }}
				/>
			))}
		</div>
	)
}

export default Calculator
