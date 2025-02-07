// components/LanguageSwitcher.tsx
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import de from "../../public/flags/de.png";
import en from "../../public/flags/en.png";
import CustomButton from "./ui/CustomButton";

const options = [
  { id: "1", name: "فارسی", value: "fa", src: de },
  { id: "2", name: "English", value: "en", src: en },
  { id: "3", name: "Deutsch", value: "de", src: de },
  { id: "4", name: "Español", value: "es", src: de },
  { id: "5", name: "العربية", value: "ar", src: de },
  // { id: "4", name: "Türkçe", value: "tr", src: de },
];

const LanguageSwitcher = ({ onClose }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(
    router.locale || "fa"
  );

  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newLang = event.target.value;
  //   setSelectedLanguage(newLang);
  //   i18n.changeLanguage(newLang);
  //   router.push(router.pathname, router.asPath, { locale: newLang });
  // };
  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    i18n.changeLanguage(newLang);
    onClose();
    // router.push(router.pathname, router.asPath, { locale: newLang });
  };
  return (
    <div className="">
      {/* <select
        value={selectedLanguage}
        onChange={handleChange}
        className=" bg-transparent text-gray-800 rounded-lg p-2 shadow-md"
      >
        {options.map((i) => (
          <option key={i.id} value={i.value} className="flex items-center">
            {i.name}
          </option>
        ))}
      </select> */}

      <div className="">
        {options.map((option) => (
          <div key={option.id}>
            <CustomButton
              onClick={() => handleLanguageChange(option.value)}
              title={option.name}
              type={
                selectedLanguage === option.value
                  ? "border-purple-btn"
                  : "primary-btn"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
