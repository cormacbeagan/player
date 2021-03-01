import { useEffect } from 'react'
import './check.css'

function Check({ onClick, check }) {
    const handleKeyUp = (e) => {
        if (e.keyCode === 67) {
            onClick()
        }
    }
    useEffect(() => {
        document.addEventListener('keyup', handleKeyUp)
        return () => {
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    const handleClick = (e) => {
        e.preventDefault()
        onClick()
    }

    return (
        <div className='divCheckStyle'>
            <a
                href='#'
                className='check-btn check-btn-white'
                onClick={handleClick}
                className={
                    check === 'CHECK'
                        ? 'check-btn check-btn-white '
                        : 'check-btn check-btn-white-checking '
                }
            >
                {check}
            </a>
        </div>
    )
}

export default Check
