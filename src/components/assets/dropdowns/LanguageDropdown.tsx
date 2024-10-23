 import React, { useState } from 'react';

export const LanguageDropdown = (setLanguage: (language: string) => void) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement> | null) => {
        if (event === null) return;
        setIsOpen((prevState) => !prevState);
    }

    const handleLanguage = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.target as HTMLButtonElement;
        if (!target.name) return;

        setIsOpen(false);
        setLanguage(target.name);
    }

    return (
        <div className="relative flex justify-center items-center">
            <button onClick={toggleDropdown} className="w-28 h-10 border border-gray-400 rounded-md hover:border-gray-500 focus:border-gray-600 duration-300 transition-all ease-in-out">Language</button>

            {isOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-32 rounded-md border border-[#bac8db]/30 bg-[#ffffff] animate-fade-in" style={{ marginTop: 4 }}>
                    <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button name='RUS' className="block px-4 py-2 text-md text-gray-700 transition duration-300 ease-in-out hover:text-[#A5B1C2] hover:backdrop-blur-sm" onClick={handleLanguage}>Рус</button>
                        <button name='KZ' className="block px-4 py-2 text-md text-gray-700 transition duration-300 ease-in-out hover:text-[#A5B1C2] hover:backdrop-blur-sm" onClick={handleLanguage}>Қаз</button>
                        <button name='ENG' className="block px-4 py-2 text-md text-gray-700 transition duration-300 ease-in-out hover:text-[#A5B1C2] hover:backdrop-blur-sm" onClick={handleLanguage}>Eng</button>
                    </div>
                </div>
            )}
        </div>
    );
}
