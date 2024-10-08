import '@testing-library/jest-dom'
import {fireEvent, render, screen} from '@testing-library/react'
import Page from '../src/pages/index'

describe('Page', () => {
    it('check counter on click me button', () => {
        render(<Page />);
        const button = screen.getByRole('button');
        const counter = screen.getByTestId('count')
        expect(button).toBeInTheDocument();
        expect(counter).toBeInTheDocument();
        expect(counter).toHaveTextContent("0");
        fireEvent.click(button);
        expect(counter).toHaveTextContent("1");
    });
})