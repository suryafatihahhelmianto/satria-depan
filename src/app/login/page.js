'use client'
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {/* Header Section */}
      <div className="text-center mb-5">
        <div className="flex justify-center items-center mb-3">
          <div className="mr-4">
            <Image src="/img/logoipb.png" alt="Logo IPB" width={150} height={150} />
          </div>
          <div>
            <Image src="/img/logorajawali.png" alt="Logo Rajawali" width={150} height={150} />
          </div>
        </div>
        <h2 className="text-green-600 text-lg font-medium">
          Selamat datang di <strong className="text-green-800">SATRIA KEREN</strong>
        </h2>
      </div>

      {/* Login Form Section */}
      <div className="bg-green-700 p-8 rounded-lg shadow-lg w-80">
        <form className="flex flex-col" action="" method="GET">
          <label htmlFor="username" className="text-left text-white mb-2">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            name="username"
            required
            className="p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:border-green-400"
          />

          <label htmlFor="password" className="text-left text-white mb-2">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            name="password"
            required
            className="p-2 mb-6 border rounded-lg focus:outline-none focus:ring focus:border-green-400"
          />

          <button
            type="submit"
            className="bg-ijoTebu text-white py-2 px-4 rounded-lg hover:bg-green-400 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
