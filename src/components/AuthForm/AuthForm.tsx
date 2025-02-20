import React, { useState } from "react";
import toast from "react-hot-toast";

// Define common properties for form components
interface AuthFormProps {
    isLogin: boolean;
    toggleType: () => void;
}
 interface  AvatarState{
    file : File | null;
    alt: string;
 }


// Reusable Form Component (Handles both Login & Signup)
const AuthForm: React.FC<AuthFormProps> = ({ isLogin, toggleType }) => {

    const [avatar,setAvatar] = useState<AvatarState >({
        file: null,
        alt: ""
    });

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setAvatar({
                file: e.target.files[0],
                alt: URL.createObjectURL(e.target.files[0]),
            });
        }
    }

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform form validation and submission logic here
    toast.success("Form submitted successfully!", )
}




    return (
        <section className="flex justify-center items-center p-6">
            <div className="bg-[#111928bf] rounded-2xl flex max-w-3xl p-5 items-center w-full">
                <div className="md:w-1/2 px-8">
                    <h2 className="font-bold text-3xl text-white">
                        {isLogin ? "Login" : "Sign Up"}
                    </h2>
                    <p className="text-sm mt-4 text-white">
                        {isLogin ? "If you're a member, log in now." : "Create an account to get started!"}
                    </p>

                    <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
                        {!isLogin && <input className="p-2 rounded-xl border" type="text" placeholder="Full Name" />}
                        <input className="p-2 rounded-xl border" type="email" placeholder="Email" />
                        <input className="p-2 rounded-xl border w-full" type="password" placeholder="Password" />
                        {!isLogin && (
                            <div className="  relative border-2 border-gray-300 border-dashed rounded-lg p-6" id="dropzone">
                                <input type="file" id="file" className="absolute inset-0 w-full h-full opacity-0 z-50"  onChange={handleAvatar} />
                                <div className="text-center">
                                    <img className="mx-auto h-12 w-12" src="./upload.svg" alt="" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        <label htmlFor="file-upload" className="relative cursor-pointer">
                                            <span className="text-white">Drag and drop</span>
                                            <span className="text-indigo-600"> or browse</span>
                                            <span className="text-white">to upload</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                    </h3>
                                    <p className="mt-1 text-xs text-white">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>

                                <img src="" className="mt-4 mx-auto max-h-40 hidden" id="preview" />
                            </div>

                        )}

                        <button className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300">
                            {isLogin ? "Login" : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className="text-blue-600 ml-1 hover:underline" onClick={toggleType}>
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>
                </div>
                <div className="md:block hidden w-1/2">
                    {!isLogin && (
                        <img  src={avatar.alt || './default_profilepic.jpg'} alt="profileImage"  className="h-[500px] w-full"/>
                    ) || (<img className="rounded-2xl w-full h-[500px] object-cover" src="./profile_pic.jpg" alt="login form image" />)}
                </div>
            </div>
        </section>
    );
};



export default AuthForm;

