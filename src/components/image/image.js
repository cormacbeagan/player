import { useEffect, useState } from 'react'
import './image.css'

function Image({ data }) {
    const [imgStyle, setImgStyle] = useState({ display: 'none' })

    useEffect(() => {
        if (data.show) {
            setImgStyle({ display: 'block' })
        } else {
            setImgStyle({ display: 'none' })
        }
    }, [data.show])

    return (
        <div className='image-container'>
            <img
                id='load'
                src={data.image}
                className='image'
                style={imgStyle}
                alt='Album Cover'
            />
        </div>
    )
}

export default Image
