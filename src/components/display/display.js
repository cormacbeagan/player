import './display.css'

function Display({ displayData }) {
    return (
        <div className='displayDiv'>
            <text className='display'>{displayData}</text>
        </div>
    )
}

export default Display
