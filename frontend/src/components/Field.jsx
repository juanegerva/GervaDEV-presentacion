import PropTypes from 'prop-types';

const Field = ({
  id,
  label,
  error = '',
  value = '',
  onChange,
  onBlur,
  required = false,
  textarea = false,
}) => {
  const inputClass = `w-full px-4 py-2 bg-gray-700 text-white rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-500' : value ? 'border-green-500' : 'border-gray-600'
  }`;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-400 mb-2">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows="4"
          required={required}
          className={inputClass}
          aria-invalid={!!error}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={inputClass}
          aria-invalid={!!error}
        />
      )}
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// Validación de props con PropTypes
Field.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  required: PropTypes.bool,
  textarea: PropTypes.bool,
};

export default Field;
