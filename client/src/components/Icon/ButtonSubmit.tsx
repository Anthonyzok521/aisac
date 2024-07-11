import React from "react";

type Props = {
  inPC: boolean;
};

export const ButtonSubmit: React.FC<Props> = ({inPC}) => {
  
  const style = `       
        transition-all 
        ${inPC ? "hover:text-white" : "hover:text-sky-500"}
        disabled:hover:text-black
        text-black 
        font-bold 
        py-2 
        px-4
        z-10
    `;
  
  return (
    <button
      disabled
      id="btn-submit"
      type="submit"
      name="submit"
      className={style}
    >
      {/* Icon Submit | SVG - Heroicons */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
        />
      </svg>
    </button>
  );
};
