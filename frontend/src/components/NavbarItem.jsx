import PropTypes from "prop-types";

const NavbarItem = ({ to, label, mobile = false, onClick }) => {
  return (
    <a
      href={to}
      className={`block px-4 py-2 w-full text-white text-center transition-all duration-200 ${
        mobile ? "hover:bg-gray-700" : "hover:text-blue-400"
      }`}
      aria-label={label}
      onClick={onClick}
    >
      {label}
    </a>
  );
};

NavbarItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  mobile: PropTypes.bool,
  onClick: PropTypes.func,
};

export default NavbarItem;
