const Button = ({ children, variant = "primary", ...props }) => {
  const base =
    "px-4 py-2 rounded font-medium transition";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      className={`${base} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
