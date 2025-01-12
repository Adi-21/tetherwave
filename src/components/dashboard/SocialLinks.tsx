import Link from "next/link";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SlSocialFacebook } from "react-icons/sl";
import { FiYoutube } from "react-icons/fi";

const SocialLinks = () => {
  return (
    <div className="flex justify-center items-center gap-4">
      {socialLinks.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className=" rounded-full p-2 drop-shadow shadow text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300"
        >
          {link.icon}
        </Link>
      ))}
    </div>
  );
};

export default SocialLinks;

const socialLinks = [
  { id: "facebook", icon: <SlSocialFacebook size={20} />, href: "#" },
  { id: "instagram", icon: <FaInstagram size={20} />, href: "#" },
  { id: "twitter", icon: <FaXTwitter size={20} />, href: "#" },
  { id: "youtube", icon: <FiYoutube size={20} />, href: "#" },
];
