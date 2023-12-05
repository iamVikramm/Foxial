/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize:{
        "5xl":"10rem"
      },
      borderColor:{
        "itemsBorderLight":"border-style : light",
        "itemsBorderColor" : "border-color : gray" 
      },
      backgroundImage: {
        'Phone': "url('../../assets/images/phone.jpg')",
        "Friends":"url('../../assets/images/friends.jpg')",
        "SignUpPageArt":"url('../../assets/images/SignUpImage.jpg')",
        "LoginPageArt":"url('../../assets/images/LoginImage.jpg')",
        "Foxial_name_logo":"url('../../assets/images/foxial_name_logo.png')",
      },
    },
  },
  plugins: [],
}