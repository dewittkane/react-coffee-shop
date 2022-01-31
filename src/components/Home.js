import PropTypes from 'prop-types';
import Thumbnail from './Thumbnail';
import { itemImages } from '../items';

function Home({ items }) {
  return (
    <div>
      {items.map((item) => (
        <Thumbnail
          key={item.id}
          image={itemImages[item.imageId]}
          title={item.title}
        />
      ))}
    </div>
  );
}

Home.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
};

export default Home;
