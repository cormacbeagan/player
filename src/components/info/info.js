import './info.css';

export default function Info(props) {
  const { text, heading } = props;

  return (
    <div className="divInfoStyle">
      <h3 className="name">{heading}</h3>
      <p className="info">{text}</p>
    </div>
  );
}
