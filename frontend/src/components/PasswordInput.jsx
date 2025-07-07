import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({ value, onChange, placeholder, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        className="input input-bordered w-full pr-10"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-2 flex items-center text-gray-500"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
