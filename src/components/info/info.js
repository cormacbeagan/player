import './info.css'

export default function Info(props) {
    const { text, heading } = props

    return (
        <div className='divInfoStyle'>
            <text className='name'>{heading}</text>
            <text className='info'>{text}</text>
        </div>
    )
}
