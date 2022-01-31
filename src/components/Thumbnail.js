import PropTypes from 'prop-types';

function Thumbnail({ image, title }) {
  return (
    <a
      href="#todo"
    >
      <img src={image} alt={title} />
      <div>{title}</div>
    </a>
  );
}

Thumbnail.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Thumbnail;
