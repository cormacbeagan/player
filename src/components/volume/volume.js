import { useEffect, useState, useRef } from 'react'
import './volume.css'

function Volume({ audioElement }) {
    const [loudness, setLoudness] = useState(0.3)
    const slider = useRef()
    let audio

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        audio = document.querySelector('#audio')
        if (audioElement) audioElement.volume = loudness
    }, [loudness])

    const handleIncrease = () => {
        if (audio.volume >= 0.95) return
        setLoudness((prev) => Number((prev += 0.05).toFixed(2)))
    }

    const handleDecrease = () => {
        if (audio.volume <= 0) return
        if (audio.volume < 0.03) {
            setLoudness((prev) => Number((prev -= 0.001).toFixed(3)))
        } else if (audio.volume < 0.2) {
            setLoudness((prev) => Number((prev -= 0.01).toFixed(2)))
        } else {
            setLoudness((prev) => Number((prev -= 0.05).toFixed(2)))
        }
    }

    const handleKeyDown = (e) => {
        if (audio.src.includes('about')) return
        if (e.keyCode === 38) {
            handleIncrease()
        } else if (e.keyCode === 40) {
            handleDecrease()
        }
    }

    function handleScroll(e) {
        if (!audio) {
            audio = document.querySelector('#audio')
        }
        if (e.deltaY < 0) {
            handleIncrease()
        } else if (e.deltaY > 0) {
            handleDecrease()
        }
    }

    const handleChange = (e) => {
        setLoudness(Number(e.target.value))
    }

    return (
        <div className='volume-container'>
            <input
                ref={slider}
                aria-label='volume control'
                id='volume'
                type='range'
                className='volume-slider'
                min='0'
                max='1'
                step='0.001'
                value={loudness}
                onChange={handleChange}
                onWheel={handleScroll}
            />
        </div>
    )
}

export default Volume
