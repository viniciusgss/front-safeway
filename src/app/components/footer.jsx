import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import Link from "next/link";

function Footer() {
  return (
    <>
      {/* Parte principal do rodapé */}
      <div className="bg-gray-800 w-full flex md:flex-row flex-col justify-around items-start p-20 text-white">
        {/* Logo + redes sociais */}
        <div className="p-5">
          <ul>
            <p className="font-bold text-3xl pb-6">
              Safe<span className="text-blue-500">Way</span>
            </p>
            <div className="flex gap-6 pb-5">

              {/* GitHub com link */}
              <Link
                href="https://github.com/seuusuario"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-2xl cursor-pointer hover:text-gray-400 transition-colors" />
              </Link>
            </div>
          </ul>
        </div>

        {/* Seções */}
        <div className="p-5">
          <ul>
            <p className="font-bold text-2xl pb-4">Front-End</p>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              React-js
            </li>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              tailwindcss
            </li>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              Next-js
            </li>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              javascript
            </li>
          </ul>
        </div>

        <div className="p-5">
          <ul>
            <p className="font-bold text-2xl pb-4">Integrantes</p>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              Arthur Pedro
            </li>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              Pedro Lacerda
            </li>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              Vinícius Gabriel
            </li>
          </ul>
        </div>

        <div className="p-5">
          <ul>
            <p className="font-bold text-2xl pb-4">Back-End</p>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              Python
            </li>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              Pandas
            </li>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              LightGBM 
            </li>
            <li className="text-gray-300 text-md pb-2 font-semibold hover:text-white cursor-pointer">
              Sklearing
            </li>

          </ul>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="flex flex-col justify-center items-center text-center p-5 bg-gray-900 text-gray-300">
        <h1 className="font-semibold text-sm md:text-base">
          © Arthur Pedro |Rayra Lima | Pedro Lacerda | Vinícius Gabriel{" "}
          <span className="hover:text-blue-400 font-semibold cursor-pointer transition-colors">
            
          </span>
        </h1>
      </div>
    </>
  );
}

export default Footer;
