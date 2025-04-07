import { ReactNode } from "react"

interface ButtonProps {
    text: String,
    w?: String,
    logo?: ReactNode,
    onClick: () => void,
    select?: boolean
}

export const Button = ({ text, w, logo, onClick, select }: ButtonProps) => {

    return <button className=" bg-gray-600 py-2 px-5 rounded-md cursor-pointer hover:bg-blue-950 transition-colors duration-300 ease-in-out flex flex-col items-center justify-center shadow-md "
        style={{
            width: `${w || "auto"}`,
            backgroundColor: select ? "#162456" : ""
        }}
        onClick={onClick}
    >
        {logo}
        {text}
    </button>
}