import React, { useState } from 'react'
import Select from 'react-select';
import { Navbar } from '../components/Navbar'
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode, HiOutlineRefresh } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {


  const frameworkPrompts = {
  "html-css": "Use pure HTML and CSS for styling.",
  "html-tailwind": "Use HTML with Tailwind CSS classes. Include Tailwind via CDN using <script src='https://cdn.tailwindcss.com'></script>.",
  "html-bootstrap": "Use HTML with Bootstrap classes. Include Bootstrap via CDN using <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'>.",
  "html-scss": "Use HTML with SCSS syntax and variables.",
  "html-js": "Use HTML, CSS, and Vanilla JavaScript for interactivity.",
  "html-gsap": "Use HTML, CSS, and GSAP for animations. Include GSAP via CDN.",
  "html-framer": "Use HTML and inline CSS but simulate Framer Motion-style smooth animations with CSS transitions.",
  "react-tailwind": "Use React with Tailwind CSS. Include Tailwind via import in index.css and className utility classes.",
  "react-bootstrap": "Use React with Bootstrap. Import required components from 'react-bootstrap'.",
  "react-scss": "Use React with SCSS modules for styling.",
  "react-gsap": "Use React with GSAP animations. Import gsap from 'gsap'.",
  "react-framer": "Use React with Framer Motion. Import { motion } from 'framer-motion'.",
  "react-motion": "Use React with the Motion library for animations.",
  "react-swiper": "Use React with Swiper.js. Import { Swiper, SwiperSlide } from 'swiper/react' and include swiper styles.",
  "react-locomotive": "Use React with Locomotive Scroll. Include locomotive-scroll via npm and use smooth scroll effects.",
  "next-tailwind": "Use Next.js with Tailwind CSS for styling and className utilities.",
  "next-framer": "Use Next.js with Framer Motion animations between sections or components.",
  "vite-react": "Use React built with Vite. Use modern JSX and functional components.",
};

const options = Object.keys(frameworkPrompts).map((key) => ({
  value: key,
  label: key.replace("-", " ").toUpperCase(), // "html-css" → "HTML CSS"
}));
  // const options = [
  //   { value: 'html-css', label: 'HTML + CSS' },
  //   { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
  //   { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
  //   { value: 'html-scss', label: 'HTML + SCSS' },
  //   { value: 'html-js', label: 'HTML + JavaScript' },
  //   { value: 'html-gsap', label: 'HTML + GSAP Animations' },
  //   { value: 'html-framer', label: 'HTML + Framer Motion' },
  //   { value: 'react-tailwind', label: 'React + Tailwind CSS' },
  //   { value: 'react-bootstrap', label: 'React + Bootstrap' },
  //   { value: 'react-scss', label: 'React + SCSS' },
  //   { value: 'react-gsap', label: 'React + GSAP Animations' },
  //   { value: 'react-framer', label: 'React + Framer Motion' },
  //   { value: 'react-motion', label: 'React + Motion' },
  //   { value: 'react-swiper', label: 'React + Swiper.js' },
  //   { value: 'react-locomotive', label: 'React + Locomotive Scroll' },
  //   { value: 'next-tailwind', label: 'Next.js + Tailwind CSS' },
  //   { value: 'next-framer', label: 'Next.js + Framer Motion' },
  //   { value: 'vite-react', label: 'Vite + React UI' },
  // ];


  const glassSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: "rgba(0, 0, 0, 0.5)", // transparent dark
      backdropFilter: "blur(10px)",
      border: state.isFocused ? "1px solid #0ff" : "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: state.isFocused ? "0 0 10px #0ff5" : "none",
      color: "#fff",
      borderRadius: "12px",
      padding: "4px",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "#0ff",
      },
    }),
    menu: (base) => ({
      ...base,
      background: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(12px)",
      borderRadius: "10px",
      marginTop: "6px",
      overflow: "hidden",
      boxShadow: "0 0 15px rgba(0, 255, 255, 0.2)",
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected
        ? "rgba(0, 255, 255, 0.2)"
        : state.isFocused
          ? "rgba(255, 255, 255, 0.1)"
          : "transparent",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(255, 255, 255, 0.6)",
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#0ff",
      "&:hover": {
        color: "#fff",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),

  };

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framwWorks, setFramwWorks] = useState(frameworkPrompts[0])
  const [Code, setCode] = useState("");
  const [loading, setLoading] = useState(false)

  // Get the API key from the environment variable
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API });

    function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const copyCode = async()=>{
    try {
      await navigator.clipboard.writeText(Code);
      toast.success('Code copied successfully ')
    } catch (err) {
      toast.error('Something went wrong')
    }
  }
 
  const downloadCode = ()=>{
    const fileName = "BlazeeUi-Code.txt";
    const blob = new Blob([Code], { type: "text/plain" });
    let url =  URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url)
    toast.success('File downloaded successfully ')
  }





//   async function getResponse() {
//     setLoading(true);
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: `
//      You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in ${options[framwWorks.value]}

// Now, generate a UI component for: ${prompt}  
// Framework to use: ${framwWorks.value}  

// Requirements:  
// - The code must be clean, well-structured, and easy to understand.  
// - Optimize for SEO where applicable.  
// - Focus on creating a modern, animated, and responsive UI design.  
// - Include high-quality hover effects, shadows, animations, colors, and typography.  
// - Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
// - Do NOT include explanations, text, comments, or anything else besides the code.  
// - And give the whole code in a single HTML file.
//       `,
//     });
//     console.log(response.text);
//     setCode(extractCode(response.text))
//     setOutputScreen(true);
//     setLoading(false);
//   }
async function getResponse() {
  if (!prompt.trim()) {
    toast.error("Please describe your component before generating!");
    return;
  }

  setLoading(true);

  const frameworkInfo = frameworkPrompts[framwWorks.value] || "Use modern web development best practices.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an expert front-end developer and UI/UX designer.

Your task: Build a modern, animated, and fully responsive UI component.

Component to create: ${prompt}

Framework/Stack to use: ${framwWorks.label}
Development context: ${frameworkInfo}

Requirements:
- Code must be clean, production-quality, and easy to understand.
- Must follow ${framwWorks.label} best practices.
- Include smooth animations, modern colors, hover effects, and responsive layout.
- If using Tailwind CSS or Bootstrap, include their CDN links.
- Return ONLY the code (no explanations, comments, or markdown).
- For React or Next.js, return complete component code ready to use.
- For HTML-based frameworks, return a single HTML file.

Output Format:
Return the final code inside one markdown code block (\`\`\`).
    `,
  });

  const text = response.text || "";
  console.log("Gemini Output:", text);

  setCode(extractCode(text));
  setOutputScreen(true);
  setLoading(false);
}


  return (
    <>
      <Navbar />
      <div className='flex items-center  px-[100px] justify-between gap-[30px]'>
        <div className='left w-[50%]  h-auto py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]'>
          <h3 className='sp-text text-[20px] font-semibold '>AI Components Genrator</h3>
          <p className='text-[gray] mt-2 mb-2 text-[16px]'>Describe your component and Ai will generate it for you</p>
          <p className='text-[15px] font-[700] mt-2 mb-2'>FrameWorks</p>
          <Select
          options={options}
            styles={glassSelectStyles}
            // options={frameworkPrompts}
            onChange={setFramwWorks}
          />
          <p className='text-[15px] font-[700] mt-4 mb-2'>Discribe your component</p>
          <textarea
            onChange={(e) => { setPrompt(e.target.value) }}
            value={prompt}
            className='w-full min-h-[200px] max-h-[200px] p-[10px] rounded-xl bg-[#09090B] mt-2'
            placeholder='Describe your component idea and Ai will build it for you ...'></textarea>
          <div className='flex items-center justify-between mt-3'>
            <p className='text-[gray]'>Click The Generate Button to Generate Code</p>
            <button
              onClick={getResponse}
              className='flex items-center  p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95'>
              <i><BsStars /> </i> 
                {
              loading === true ?<>

              <ClipLoader size={'23px'} />
            
              </> : ""
            }
                Generate
            </button>
          </div>
        </div>
        <div className='right relative w-[50%] h-[80vh] bg-[#141319] mt-5 rounded-xl'>
          {
                

            outputScreen === false ? <>
           
              

              <div className="section w-full h-full flex items-center flex-col justify-center">
                <div className="circel flex items-center justify-center text-[30px] p-[20px] w-[70px]  h-[70px] rounded-[50%] bg-gradient-to-r from-purple-400 to-purple-600 "><HiOutlineCode /></div>
                <p className='text-[16px] text-[gray] mt-4' >Your Code Appear Here</p>
              </div>
            </> : <>
              <div className="top w-full h-[60px]  flex items-center gap-[15px] px-[20px]">
                <button onClick={() => { setTab(1) }} className={`btn w-[50%]  p-[10px] rounded-xl cursor-pointer transition-all ${tab === 1 ? 'bg-purple-400' : ""}`} > Code </button>
                <button onClick={() => { setTab(2) }} className={`btn w-[50%]  p-[10px] rounded-xl cursor-pointer transition-all ${tab === 2 ? 'bg-purple-400' : ""}`}>Preview</button>
              </div>
              <div className="top-2 w-full h-[60px]  flex items-center justify-between gap-[15px] px-[20px]">
                <div className="left">
                  {
                    tab === 1 ? <>
                      <p className='font-bold'  >Code Editor</p>
                    </> : <>
                      <p className='font-bold'>Live Preview</p>
                    </>
                  }
                </div>
                <div className="right flex items-center gap-[15px]">
                  {
                    tab === 1 ? <>
                      <button 
                       onClick={copyCode}
                      className="copy cursor-pointer w-[40px] h-[40px] border-[1px] border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#333] "><IoCopy /></button>
                      <button 
                      onClick={downloadCode}
                      className="export cursor-pointer w-[40px] h-[40px] border-[1px] border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#333]"><PiExportBold /></button>
                    </> : <>
                      <button className="copy cursor-pointer text-[14px] w-[100px] h-[40px] border-[1px] border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#333] gap-[5px]"><FaArrowUpRightFromSquare /> New Tab</button>
                      <button className="export cursor-pointer text-[15px] w-[100px] h-[40px] border-[1px] border-gray-800 rounded-lg flex items-center justify-center gap-[5px] hover:bg-[#333]"><HiOutlineRefresh /> Refresh</button>
                    </>
                  }

                </div>
              </div>
              <div className="editor w-full h-[68vh]">
                {
                  tab === 1 ? <>
                    <Editor height="100%" theme='vs-dark' language="html" value={Code} />
                  </> : <>
                    <iframe srcDoc={Code} className="preview bg-white text-black w-full h-full flex items-center justify-center"></iframe>
                  </>
                }
              </div>
            </>


          }
        </div>

      </div>
    </>
  )
}

export default Home