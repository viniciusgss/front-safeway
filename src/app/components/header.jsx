import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-blue-800 px-6 py-3 flex justify-end items-center text-white">
      
      <div className="flex items-center space-x-2">
        <FaUserCircle size={24} />
        <span className="text-sm">exemplo@gmail.com</span>
      </div>
    </header>
  );
}
