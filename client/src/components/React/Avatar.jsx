//Show Icon Avatar | User or AI
import Icon from "../../../public/favicon.svg";
const Avatar = ({ role, size }) => {
    if(role === "user"){
        return (
            //User Icon | SVG - Heroicons
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

        )
    }

    return (
        //Logo AISAC
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} version="1.1" viewBox="0 0 512 512">
 <g stroke-linecap="round">
  <path d="m96.958 445.44-0.24632-276.4 159.39-122.78 158.49 124.46 0.0423 273.22" fill="#0048a2" stroke="#0180fa" stroke-linejoin="round" stroke-width="64.273"/>
  <rect x="168.27" y="320.5" width="25.009" height=".62763" fill="#003b85" stroke="#fff" stroke-width="30.394"/>
  <rect x="316.34" y="321.64" width="25.009" height=".62763" fill="#003b85" stroke="#fff" stroke-width="30.394"/>
  <path d="m479.78 480.06-227.18-153.97-220.12 153.72" fill="#0048a2" stroke="#0180fa" stroke-linejoin="round" stroke-width="64.273"/>
  <g fill="#003b85" stroke="#fff" stroke-width="30.394">
   <rect x="167.68" y="206.92" width="25.009" height=".62763"/>
   <rect x="167.68" y="264.01" width="25.009" height=".62763"/>
   <rect x="315.75" y="208.06" width="25.009" height=".62763"/>
   <rect x="315.75" y="265.15" width="25.009" height=".62763"/>
  </g>
 </g>
</svg>
    )
}

export default Avatar;